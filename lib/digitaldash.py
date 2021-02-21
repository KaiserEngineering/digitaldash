from typing import NoReturn, List, TypeVar
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.relativelayout import RelativeLayout
from kivy.properties import StringProperty
from kivy.uix.anchorlayout import AnchorLayout
from kivy.clock import Clock
from kivy.core.window import Window

from etc import config
from lib.base import Base
from lib.dynamic import Dynamic
from lib.alert import Alert
from lib.alerts import Alerts
from lib.pid import PID
from ke_protocol import build_update_requirements_bytearray

# Import custom gauges
from local.gauges import *

class Background(AnchorLayout):
    """Uses Kivy language to create background."""
    source = StringProperty()
    def __init__(self, BackgroundSource="", WorkingPath=""):
      super().__init__()
      Logger.debug( "GUI: Creating new Background obj with source: "+str(BackgroundSource) )
      self.source = f"{WorkingPath + '/static/imgs/Background/'}{BackgroundSource}"

def findPids( view ):
    """Find all PIDs in a view"""
    pids_dict = {}
    for i, gauge in enumerate( view['gauges'] ):
        if gauge['pid'] in pids_dict:
          continue
        pids_dict[gauge['pid']] = PID( **gauge )
        view['gauges'][i]['pid'] = pids_dict[gauge['pid']]

    for i, alert in enumerate( view['alerts'] ):
        if alert['pid'] in pids_dict:
          continue
        pids_dict[alert['pid']] = PID( **alert )
        view['alerts'][i]['pid'] = pids_dict[alert['pid']]

    # if view['dynamic'] and view['dynamic']['enabled']:
    #     if not view['dynamic']['pid'] in pids_dict:
    #       pids_dict[view['dynamic']['pid']] = PID( **view['dynamic'] )
    #       view['dynamic']['pid'] = pids_dict[view['dynamic']['pid']]

    return list(pids_dict.values())

def findUnits( view ):
    """Create a dictionary of PIDs and their corresponding unit"""
    units = {}
    for gauge in view['gauges']:
      units[gauge['pid']] = gauge['unit']
    for alert in view['alerts']:
      units[alert['pid']] = alert['unit']
    if view['dynamic'] and view['dynamic']['enabled']:
      units[view['dynamic']['pid']] = view['dynamic']['unit']
    return units

def setup(self, Layouts):
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    # Callbacks are things like Dynamic objects and Alerts that we need to check
    callbacks    = {}
    views        = []
    containers   = []
    dynamic_pids = []
    # Currently we only allow one type of units per PID
    units        = {}

    # Sort based on default value
    for id in Layouts['views']:
        # Make sure a callback key exist for each view Id
        callbacks.setdefault( id, [] )

        view = Layouts['views'][id]
        # Skip disabled views
        if not view['enabled']: continue

        pids  = findPids( view )
        units = { **units, **findUnits( view ) }

        background = view['background']

        # Create our callbacks
        if view['dynamic'].keys():
            dynamicConfig = view['dynamic']
            dynamicConfig['viewId'] = id

            # Keep track of our dynamic PIDs
            dynamicPID = PID( **dynamicConfig )
            dynamic_pids.append( dynamicPID )

            # Replace our string pid value with our new object
            dynamicConfig['pid'] = dynamicPID

            dynamic_obj = Dynamic()
            (ret, msg) = dynamic_obj.new( **dynamicConfig )
            if ret:
                callbacks.setdefault('dynamic', []).append(dynamic_obj)
            else:
                Logger.error(msg)
                callbacks.setdefault('dynamic', [])
        else:
            callbacks.setdefault('dynamic', [])

        if len(view['alerts']):
            for alert in view['alerts']:
                alert['viewId'] = id

                callbacks.setdefault(id, []).append(Alert(**alert))
        else:
            callbacks.setdefault(id, [])

        container       = FloatLayout()
        ObjectsToUpdate = []

        num_gauges = len(view['gauges']) or 1
        # Get our % width that each gauge should claim
        # The 0.05 is our squish value to move gauges inwards
        percent_width = ( 1 / num_gauges ) - 0.05

        for gauge_count, widget in enumerate( view['gauges'] ):
            mod = None

            x_position = ( percent_width * gauge_count )

            # This handles our gauge positions, see the following for reference:
            # https://kivy.org/doc/stable/api-kivy.uix.floatlayout.html#kivy.uix.floatlayout.FloatLayout
            subcontainer = RelativeLayout(
                pos_hint={'x': x_position, 'top': .99},
                size_hint_max_y=200,
                size_hint_max_x=(Window.width - 100 ) / num_gauges
            )
            container.add_widget(subcontainer)

            module = None
            try:
                # This loads any standalone modules
                module = globals()[widget['module']]()
            except KeyError:
                module = Base(gauge_count=len(view['gauges']))
            ObjectsToUpdate.append(
                module.build_component(
                    working_path=self.WORKING_PATH,
                    container=subcontainer,
                    view_id=int(id),
                    x_position = x_position,
                    **widget,
                    **view
                )
            )

        containers.append(container)

        views.append({'app': Background(WorkingPath=self.WORKING_PATH, BackgroundSource=background), 'alerts': FloatLayout(),
                      'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids})

    # We need to retro-actively add our dynamic PIDs into the PIDs array per view
    for i, view in enumerate(views):
      for pid in dynamic_pids:
        if pid not in view['pids']:
          views[i]['pids'].append( pid )

      # Now we can generate a complete byte array for the PIDs
      if ( len(units) and len(view['pids']) ):
          if ( list(units.keys())[0] != 'n/a' and view['pids'][0] != 'n/a' ):
              views[i]['pid_byte_code'] = build_update_requirements_bytearray( views[i]['pids'] )
    return (views, containers, callbacks)

def build_from_config(self, Data_Source=None) -> NoReturn:
    # Current is used to track which viewId we are currently displaying.
    # This is important for skipping dynamic checks that we don't need to check.
    self.current = 0
    self.first_iteration = False if hasattr(self, 'first_iteration') else True

    (self.views, self.containers, self.callbacks) = setup(self, config.views(file=self.configFile))

    # Sort our dynamic and alerts callbacks by priority
    self.dynamic_callbacks = sorted(self.callbacks['dynamic'],
                                    key=lambda x: x.priority, reverse=True)
    # Since we are building for the first time we can default to index 0
    self.alert_callbacks = sorted(self.callbacks['0'],
                                  key=lambda x: x.priority, reverse=True)

    (self.background, self.alerts,
     self.ObjectsToUpdate, self.pids, self.pid_byte_code) = self.views[0].values()

    if not self.first_iteration and Data_Source and type(Data_Source) != Test:
    #Initialize our hardware set-up and verify everything is peachy
        (ret, msg) = Data_Source.initialize_hardware()

        if not ret:
            Logger.error("Hardware: Could not initialize hardware: " + msg)
            count = 0
            # Loop in the restart process until we succeed
            while (not ret and count < 3):
                Logger.error("Hardware: Running hardware restart, attempt :#" + str(count))
                (ret, msg) = Data_Source.initialize_hardware()

                if not ret:
                    count = count + 1
                    Logger.error("Hardware: Hardware restart attempt: #"+str(count)
                                 +" failed: " + msg)
        else:
            Logger.info(msg)
        self.data_source = Data_Source

    self.app.add_widget(self.background)
    self.background.add_widget(self.containers[0])
    self.background.add_widget(self.alerts)

    # Unschedule our previous clock event
    if hasattr(self, 'clock_event'): self.clock_event.cancel()
    if self.data_source: self.clock_event = Clock.schedule_interval(self.loop, 0)

    return self.app
