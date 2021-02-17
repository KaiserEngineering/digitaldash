"""Main start module"""

# Dependent modules and packages
import getopt
import sys
from test import Test
import os
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())
os.environ["KIVY_HOME"] = WORKING_PATH + "/etc/kivy/"

(Data_Source, TESTING, ConfigFile) = (False, False, None)

opts, args = getopt.getopt(sys.argv[1:], "tdf:c:", ["test", "development", "file=", "config="])

sys.argv = ['main.py']
for o, arg in opts:
    # Development mode runs with debug console - ctr + e to open it in GUI
    if o in ("-d", "--development"):
        sys.argv = ['main.py -m console']
    elif o in ("-f", "--file"):
        Data_Source = Test(file=arg)
    elif o in ("-t", "--test"):
        TESTING = True
    elif o in ("-c", "--config"):
        ConfigFile = arg

# Our Kivy deps
import kivy
from kivy.logger import Logger
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.anchorlayout import AnchorLayout
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from typing import NoReturn, List, TypeVar

# Rust import
import libdigitaldash

from lib.digitaldash import build_from_config
from _version import __version__
from etc import config

config.setWorkingPath(WORKING_PATH)

if not Data_Source:
    try:
        from ke_protocol import Serial
        Data_Source = Serial()
        Logger.info("Using serial data source" + str(Data_Source))
    except Exception as e:
        Logger.info("Running without serial data: " + str(e))

class MyHandler(PatternMatchingEventHandler):
    """
    Class that handles file watchdog duties.
    """
    def __init__(self, DigitalDash):
        super(MyHandler, self).__init__()
        self.DigitalDash = DigitalDash

    patterns = ["*.json"]

    def on_modified(self, event):
        build_from_config(self.DigitalDash, Data_Source)

# Load our KV files
for file in os.listdir(WORKING_PATH+'/kv/'):
    Builder.load_file(WORKING_PATH+'/kv/'+str(file))

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

    def new(self, configFile=None, data=None):
        """
        This method can be used to set any values before the app starts, this is useful for
        testing.
        """
        self.configFile   = configFile
        self.WORKING_PATH = WORKING_PATH

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

        return build_from_config(self, Data_Source)

    def check_callback(self: DD, callback, data):
        ret = False
        try:
          # Check if any dynamic changes need to be made
          if libdigitaldash.check(float(data[callback.pid]), callback.value, callback.op):
              ret = callback
        except Exception as e:
          Logger.error( "GUI: Firmware did not provide data value for key: %s, %s", callback.pid, str(e) )
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

        (my_callback, priority, data) = (None, 0, Data_Source.service(app=self, pids=self.pids))

        dynamic_change = False
        # Check dynamic gauges before any alerts in case we make a change
        for dynamic in self.dynamic_callbacks:
            my_callback = self.check_callback(dynamic, data)

            if my_callback:
              if self.current == dynamic.index:
                break
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

if __name__ == '__main__':
    Logger.info( 'GUI: Running version: %s'%__version__ )
    dd = GUI()

    dd.new(configFile=ConfigFile, data=Data_Source)

    dd.run()
