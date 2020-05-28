# Dependent modules and packages
import getopt
import sys
from .test import Test
import os

os.environ["KIVY_HOME"] = os.getcwd() + "/digital_dash_gui/etc/kivy/"

(run, Data_Source) = (True, False)

opts, args = getopt.getopt(sys.argv[1:], "tdf:c:", ["test", "development", "file=", "config="])

for o, arg in opts:
    # test mode will not run GUI
    if ( o in ("-t", "--test") ):
        sys.argv = ['main.py']
    # Development mode runs with debug console - ctr + e to open it in GUI
    elif ( o in ( "-d", "--development" )  ):
        sys.argv = ['main.py -m console']
    if ( o in ( "-f", "--file" ) ):
        Data_Source = Test(file=arg)

if not len(opts):
    run      = False
    sys.argv = ['main.py']

# Our Kivy deps
import kivy
from kivy.logger import Logger
from kivy.clock import Clock
from kivy.app import App
from kivy.lang import Builder
from kivy.properties import StringProperty
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.boxlayout import BoxLayout
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from typing import NoReturn, List, TypeVar
from .etc.config import views
from .digitaldash.base import Base
from .digitaldash.dynamic import Dynamic
from .digitaldash.alert import Alert
from .digitaldash.clock import Clock as KEClock


try:
    from digital_dash_gui.ke_protocol import Serial
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
    for id in sorted(Layouts['views'], key=lambda id: Layouts['views'][id].get('default', 0), reverse=True):
        view = Layouts['views'][id]
        # Skip disabled views
        if (not view['enabled']): continue

        background = view['background']
        pids       = view['pids']

        # Create our callbacks
        if view['dynamic'].keys():
            dynamic = view['dynamic']
            dynamic['index'] = id

            dynamic_obj = Dynamic()
            (ret, msg) = dynamic_obj.new(**dynamic)
            if ( ret ):
              callbacks.setdefault('dynamic', []).append(dynamic_obj)
            else:
                Logger.error( msg )
                callbacks.setdefault('dynamic', [])
        else:
            callbacks.setdefault('dynamic', [])

        if len(view['alerts']):
            for alert in view['alerts']:
                alert['index'] = id

                callbacks.setdefault(view_count, []).append(Alert(**alert))
        else:
            callbacks.setdefault(view_count, [])

        container = BoxLayout(padding=(30, 0, 30, 0))
        ObjectsToUpdate = []

        for widget in view['gauges']:
            mod = None

            try:
                # This loads any standalone modules
                mod = globals()[widget['module']]()
            except KeyError:
                mod = Base(gauge_count=len(view['gauges']))
            ObjectsToUpdate.append(mod.buildComponent(container=container, view_id=int(id), **widget, **view))

        containers.append(container)

        views.append({'app': Background(), 'background': background, 'alerts': FloatLayout(),
                    'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids})
        view_count += 1

    return (views, containers, callbacks)

def on_config_change(self):
        """
        Method for reloading config data.
        """
        global ConfigFile

        (self.views, self.containers, self.callbacks) = setup(views(ConfigFile))
        self.app.clear_widgets()

        (self.background, self.background_source, self.alerts, self.ObjectsToUpdate, self.pids) = self.views[0].values()

        self.app.add_widget(self.background)
        self.background.add_widget(self.containers[0])
        self.background.add_widget(self.alerts)

        # Sort our dynamic and alerts callbacks by priority
        self.dynamic_callbacks = sorted(self.callbacks['dynamic'], key=lambda x: x.priority, reverse=True)
        self.alert_callbacks   = sorted(self.callbacks[self.current], key=lambda x: x.priority, reverse=True)


class MyHandler(PatternMatchingEventHandler):
    """
    Class that handles file watchdog duties.
    """
    def __init__(self, DigitalDash):
        super(MyHandler, self).__init__()
        self.DigitalDash = DigitalDash


    patterns = ["*.json", "*.py", ".*kv"]

    def process(self, event):
        """
        event.event_type
            'modified' | 'created' | 'moved' | 'deleted'
        event.is_directory
            True | False
        event.src_path
            path/to/observed/file
        """
        # the file will be processed there
        on_config_change(self.DigitalDash)

    def on_modified(self, event):
        self.process(event)

    def on_created(self, event):
        self.process(event)


Builder.load_file('digital_dash_gui/digitaldash/kv/main.kv')

(ConfigFile, errors_seen) = (None, {})
DD = TypeVar('DD', bound='DigitalDash')
class GUI(App):
    """
    Main class that initiates kivy app.

    This class instantiates the KE module which will build
    the DigitalDash. Main loop is here for updating data within
    DigitalDash. The loop will iterate through the **widgets**
    array and call the **setData()** method on each item in the
    array. Only add Objects to the **widgets** array if they are
    to be updated and have the necessary methods.
    """

    background_source = StringProperty()

    def new(self, config=None, data=None):
        """
        This method can be used to set any values before the app starts, this is useful for
        testing.
        """
        global ConfigFile
        ConfigFile  = config
        self.config = ConfigFile

        if ( data ):
            global Data_Source
            Data_Source = data

    def build(self):
        """Perform main build loop for Kivy app."""

        # Our main application object
        self.app = AnchorLayout()

        self.data_source = Data_Source

        self.current = 0
        global ConfigFile

        (self.views, self.containers, self.callbacks) = setup(views(file=ConfigFile))

        # Sort our dynamic and alerts callbacks by priority
        self.dynamic_callbacks = sorted(self.callbacks['dynamic'], key=lambda x: x.priority, reverse=True)
        self.alert_callbacks   = sorted(self.callbacks[self.current], key=lambda x: x.priority, reverse=True)

        (self.background, self.background_source, self.alerts, self.ObjectsToUpdate, self.pids) = self.views[0].values()

        if ( Data_Source and type(Data_Source) != Test ):
            #Initialize our hardware set-up and verify everything is peachy
            (ret, msg) = Data_Source.InitializeHardware()

            if ( not ret ):
                Logger.error("Hardware: Could not initialize hardware: " + msg)
                count = 0
                # Loop in the restart process until we succeed
                while ( not ret and count < 3 ):
                    Logger.error("Hardware: Running hardware restart, attempt :#" + str(count))
                    (ret, msg) = Data_Source.InitializeHardware()

                    if ( not ret ):
                        count = count + 1
                        Logger.error( "Hardware: Hardware restart attempt: #"+str(count)+" failed: " + msg )
            else:
                Logger.info( msg )
            self.data_source = Data_Source

        self.first_iteration = True
        self.app.add_widget(self.background)
        self.background.add_widget(self.containers[0])
        self.background.add_widget(self.alerts)

        # We consider program start a config change since it is just loading
        # data from the config file
        on_config_change(self)
        if self.data_source: Clock.schedule_interval(self.loop, 0)

        observer = Observer()
        observer.schedule(MyHandler(self), './', recursive=True)
        observer.start()

        return self.app

    def check_callback(self: DD, callback, priority, data):
        # Check if any dynamic changes need to be made
        if ( callback.check(data[callback.pid]) ):
            callback.buffer += 1

            # # Buffer is how many times we have seen our
            if ( callback.buffer >= 20 ):
                if (self.current != callback.index and type(callback) is Alert):
                    self.alerts.clear_widgets()
            return callback
        else:
            callback.buffer = 0
        return False

    def change(self: DD, app, my_callback) -> NoReturn:
        if ( my_callback.change(self, my_callback) ):
            self.current = my_callback.index
        elif type(my_callback) is Alert and my_callback.parent is None and self.current == my_callback.index:
            self.alerts.add_widget(my_callback)

    def update_values(self: DD, data: List[float]) -> NoReturn:
        for widget in self.ObjectsToUpdate:
            for obj in widget:
                obj.setData(data[obj.pid])

    def loop(self, dt):
        global errors_seen
        try:
            if ( self.first_iteration ):
                (ret, msg) = Data_Source.UpdateRequirements( self.pids )
                if ( not ret ):
                    Logger.error( msg )
                self.first_iteration = False
            ( my_callback, priority, data ) = ( None, 0, Data_Source.Start(pids=self.pids) )
            # Check dynamic gauges before any alerts in case we make a change
            for dynamic in self.dynamic_callbacks:
                if self.current == dynamic.index:
                    continue
                my_callback = self.check_callback(dynamic, priority, data)

                if(my_callback):
                    self.change(self, my_callback)
                    break

            for callback in self.alert_callbacks:
                my_callback = self.check_callback(callback, priority, data)

                if(my_callback):
                    self.change(self, my_callback)
                    break
            self.update_values(data)
        except Exception as e:
            error = 'Error found in main application loop on line {}: '.format(sys.exc_info()[-1].tb_lineno), type(e).__name__, e
            Logger.error(error)

            if e in errors_seen:
                errors_seen[e] = errors_seen[e] + 1
            else:
                errors_seen[e] = 1

            if errors_seen[e] >= 3:
                (ret, msg) = Data_Source.PowerCycle()
                if ( not ret ):
                    Logger.error( msg )


class Background(AnchorLayout):
    """Uses Kivy language to create background."""
    pass

def run():
    dd = GUI()

    config = None
    for o, arg in opts:
        if o in ( "-c", "--config" ):
            config = arg
    dd.new(config=config, data=Data_Source)

    dd.run()
