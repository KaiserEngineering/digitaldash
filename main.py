"""Main start module"""

# Dependent modules and packages
import getopt
import sys
from test import Test
import os
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())
os.environ["KIVY_HOME"] = WORKING_PATH + "/etc/kivy/"

(Data_Source, TESTING) = (False, False)

opts, args = getopt.getopt(sys.argv[1:], "tdf:c:", ["test", "development", "file=", "config="])

sys.argv = ['main.py']
for o, arg in opts:
    # Development mode runs with debug console - ctr + e to open it in GUI
    if o in ("-d", "--development"):
        sys.argv = ['main.py -m console']
    if o in ("-f", "--file"):
        Data_Source = Test(file=arg)
    if o in ("-t", "--test"):
        TESTING = True

# Our Kivy deps
import kivy
from kivy.logger import Logger
from kivy.clock import Clock
from kivy.app import App
from kivy.lang import Builder
from kivy.properties import StringProperty
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.relativelayout import RelativeLayout
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from typing import NoReturn, List, TypeVar

# Rust import
import libdigitaldash

from etc import config
from digitaldash.base import Base
from digitaldash.dynamic import Dynamic
from digitaldash.alert import Alert
from digitaldash.alerts import Alerts
from ke_protocol import build_update_requirements_bytearray

config.setWorkingPath(WORKING_PATH)

# Import custom gauges
from local.gauges import *

if not Data_Source:
    try:
        from ke_protocol import Serial
        Data_Source = Serial()
        Logger.info("Using serial data source" + str(Data_Source))
    except Exception as e:
        Logger.info("Running without serial data: " + str(e))

def setup(Layouts):
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    callbacks  = {}
    views      = []
    containers = []
    view_count = 0

    # Sort based on default value
    for id in sorted(Layouts['views'],
                     key=lambda id: Layouts['views'][id].get('default', 0), reverse=True):
        view = Layouts['views'][id]
        # Skip disabled views
        if not view['enabled']: continue

        # Get our PIDs list from the gauges, alerts and dynamic config
        pids_dict = {}
        for gauge in view['gauges']:
          pids_dict[gauge['pid']] = 1
        for alert in view['alerts']:
          pids_dict[alert['pid']] = 1
        if view['dynamic'] and view['dynamic']['enabled']:
          pids_dict[view['dynamic']['pid']] = 1
        pids = list(pids_dict.keys())

        # Get our units dict from the gauges, alerts and dynamic config
        units = {}
        for gauge in view['gauges']:
          units[gauge['pid']] = gauge['unit']
        for alert in view['alerts']:
          units[alert['pid']] = alert['unit']
        if view['dynamic'] and view['dynamic']['enabled']:
          units[view['dynamic']['pid']] = view['dynamic']['unit']

        background = view['background']

        # Create our callbacks
        if view['dynamic'].keys():
            dynamic = view['dynamic']
            dynamic['index'] = view_count

            dynamic_obj = Dynamic()
            (ret, msg) = dynamic_obj.new(**dynamic)
            if ret:
                callbacks.setdefault('dynamic', []).append(dynamic_obj)
            else:
                Logger.error(msg)
                callbacks.setdefault('dynamic', [])
        else:
            callbacks.setdefault('dynamic', [])

        if len(view['alerts']):
            for alert in view['alerts']:
                alert['index'] = view_count

                callbacks.setdefault(view_count, []).append(Alert(**alert))
        else:
            callbacks.setdefault(view_count, [])

        container       = FloatLayout()
        ObjectsToUpdate = []

        num_gauges = len(view['gauges'])
        # Get our % width that each gauge should claim
        # The 0.05 is our squish value to move gauges inwards
        percent_width = ( 1 / num_gauges if num_gauges else 1 ) - 0.05

        multi_offset = 0;
        # Only set offset if more than 1 gauge
        if num_gauges > 1:
            multi_offset = percent_width * ( num_gauges / 2 - 0.5 )

        for gauge_count, widget in enumerate( view['gauges'] ):
            mod = None

            x_position = ( percent_width * gauge_count ) - multi_offset

            # This handles our gauge positions, see the following for reference:
            # https://kivy.org/doc/stable/api-kivy.uix.floatlayout.html#kivy.uix.floatlayout.FloatLayout
            subcontainer = RelativeLayout(
                pos_hint={'x': x_position, 'top': .99},
                size_hint_max_y=200
            )
            container.add_widget(subcontainer)

            mod = None
            try:
                # This loads any standalone modules
                mod = globals()[widget['module']]()
            except KeyError:
                mod = Base(gauge_count=len(view['gauges']))
            ObjectsToUpdate.append(
                mod.build_component(
                    working_path=WORKING_PATH,
                    container=subcontainer,
                    view_id=int(id),
                    x_position = x_position,
                    **widget,
                    **view
                )
            )

        containers.append(container)

        pid_byte_code = None
        if ( len(units) and len(pids) ):
            if ( list(units.keys())[0] != 'n/a' and pids[0] != 'n/a' ):
                pid_byte_code = build_update_requirements_bytearray( units, pids )

        views.append({'app': Background(), 'background': background, 'alerts': FloatLayout(),
                      'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids, 'pid_byte_code': pid_byte_code})
        view_count += 1
    return (views, containers, callbacks)

def build_from_config(self) -> NoReturn:
    self.current = 0
    self.first_iteration = False if hasattr(self, 'first_iteration') else True
    global ConfigFile

    (self.views, self.containers, self.callbacks) = setup(config.views(file=ConfigFile))

    # Sort our dynamic and alerts callbacks by priority
    self.dynamic_callbacks = sorted(self.callbacks['dynamic'],
                                    key=lambda x: x.priority, reverse=True)
    # Since we are building for the first time we can default to index 0
    self.alert_callbacks = sorted(self.callbacks[0],
                                  key=lambda x: x.priority, reverse=True)

    (self.background, self.background_source, self.alerts,
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

class MyHandler(PatternMatchingEventHandler):
    """
    Class that handles file watchdog duties.
    """
    def __init__(self, DigitalDash):
        super(MyHandler, self).__init__()
        self.DigitalDash = DigitalDash

    patterns = ["*.json"]

    def on_modified(self, event):
        build_from_config(self.DigitalDash)

# Load our KV files
for file in os.listdir(WORKING_PATH+'/digitaldash/kv/'):
    Builder.load_file(WORKING_PATH+'/digitaldash/kv/'+str(file))

ConfigFile = None
DD = TypeVar('DD', bound='DigitalDash')
class GUI(App):
    """
    Main class that initiates kivy app.

    This class instantiates the KE module which will build
    the DigitalDash. Main loop is here for updating data within
    DigitalDash. The loop will iterate through the **widgets**
    array and call the **set_data()** method on each item in the
    array. Only add Objects to the **widgets** array if they are
    to be updated and have the necessary methods.
    """

    background_source = StringProperty()

    def new(self, configFile=None, data=None):
        """
        This method can be used to set any values before the app starts, this is useful for
        testing.
        """
        global ConfigFile
        ConfigFile = configFile
        self.config = ConfigFile

        if data:
            global Data_Source
            Data_Source = data

    def build(self):
        """Called at start of application"""

        # Our main application object
        self.app = AnchorLayout()

        self.data_source = Data_Source
        self.working_path = WORKING_PATH

        observer = Observer()
        observer.schedule(MyHandler(self), WORKING_PATH+'/etc/', recursive=True)
        observer.start()

        return build_from_config(self)

    def check_callback(self: DD, callback, data):
        ret = False
        try:
          # Check if any dynamic changes need to be made
          if libdigitaldash.check(float(data[callback.pid]), callback.value, callback.op):
              ret = callback
        except:
          Logger.error( "GUI: Firmware did not provide data value for key: %s", callback.pid )
        return ret

    def change(self: DD, app, my_callback) -> NoReturn:
        """
        This method only handles dynamic changing, the alert changing is handled in
        the main application loop.
        """
        self.current = my_callback.index
        my_callback.change(self)

    def update_values(self: DD, data: List[float]) -> NoReturn:
        for widget in self.ObjectsToUpdate:
            for obj in widget:
                if obj.pid:
                    try:
                        obj.set_data(data[obj.pid])
                    except:
                        Logger.error( "GUI: Firmware did not provide data value for key: %s", obj.pid )
                else:
                    # This is for widgets that subscribe to
                    # updates but don't need any pid data ( Clock ).
                    obj.set_data(0)

    def loop(self, dt):
        if self.first_iteration:
            (ret, msg) = Data_Source.update_requirements(self, self.pid_byte_code, self.pids)
            if not ret:
                Logger.error(msg)
            self.first_iteration = False
        (my_callback, priority, data) = (None, 0, Data_Source.start(app=self, pids=self.pids))

        dynamic_change = False
        # Check dynamic gauges before any alerts in case we make a change
        for dynamic in self.dynamic_callbacks:
            if self.current == dynamic.index:
                continue
            my_callback = self.check_callback(dynamic, data)

            if my_callback:
                self.change(self, my_callback)
                dynamic_change = True
                break

        # Check our alerts if no dynamic changes have occured
        if not dynamic_change:
            for callback in self.alert_callbacks:
                my_callback = self.check_callback(callback, data)

                if my_callback:
                    if callback.parent is None:
                        self.alerts.add_widget(my_callback)
                elif callback.parent:
                    self.alerts.remove_widget(callback)

            self.update_values(data)

class Background(AnchorLayout):
    """Uses Kivy language to create background."""

if __name__ == '__main__':
    dd = GUI()

    configFile = None
    for o, arg in opts:
        if o in ("-c", "--config"):
            configFile = arg
    dd.new(configFile=configFile, data=Data_Source)

    dd.run()
