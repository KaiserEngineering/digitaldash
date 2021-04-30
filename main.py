"""Main start module"""

# Dependent modules and packages
import getopt
import sys
from digitaldash.test import Test
import os
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())
os.environ["KIVY_HOME"] = WORKING_PATH + "/etc/kivy/"

(dataSource, TESTING, ConfigFile) = (False, False, None)

opts, args = getopt.getopt(
    sys.argv[1:], "tdf:c:", ["test", "development", "file=", "config="]
)

sys.argv = ["main.py"]
for o, arg in opts:
    # Development mode runs with debug console - ctr + e to open it in GUI
    if o in ("-d", "--development"):
        sys.argv = ["main.py -m console"]
    elif o in ("-f", "--file"):
        dataSource = Test(file=arg)
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
from kivy.uix.label import Label
from watchdog.events import PatternMatchingEventHandler
from typing import NoReturn, List, TypeVar
from kivy.clock import mainthread, Clock

# Rust import
import libdigitaldash

from digitaldash.digitaldash import buildFromConfig
from _version import __version__
from etc import config

config.setWorkingPath(WORKING_PATH)

if not dataSource:
    try:
        from digitaldash.keProtocol import Serial

        dataSource = Serial()
        Logger.info("Using serial data source" + str(dataSource))
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

    def rebuild(self, dt):
      Logger.info("Rebuilding config")
      buildFromConfig(self.DigitalDash, dataSource)
      if self.DigitalDash.data_source:
          self.DigitalDash.clock_event = Clock.schedule_interval(self.DigitalDash.loop, 0)

    @mainthread
    def on_modified(self, event):
      if hasattr(self.DigitalDash, "clock_event"):
          self.DigitalDash.clock_event.cancel()
      Clock.schedule_once(self.rebuild, 0)


# Load our KV files
for file in os.listdir(WORKING_PATH + "/digitaldash/kv/"):
    Builder.load_file(WORKING_PATH + "/digitaldash/kv/" + str(file))

DD = TypeVar("DD", bound="DigitalDash")


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
    success: str
    status : str

    def new(self, configFile=None, data=None):
        """
        This method can be used to set any values before the app starts, this is useful for
        testing.
        """
        self.configFile = configFile
        self.WORKING_PATH = WORKING_PATH
        self.count = 0

        self.success = 1
        self.status  = ''

        if data:
            global dataSource
            dataSource = data

    def build(self):
        """Called at start of application"""

        # Our main application object
        self.app = AnchorLayout()

        self.data_source = dataSource
        self.working_path = WORKING_PATH

        observer = Observer()
        observer.schedule(MyHandler(self), WORKING_PATH + "/etc/", recursive=True)
        observer.start()

        buildFromConfig(self, dataSource)

        # If something went wrong in build return a label with the error message:
        if not self.success:
            return Label(text=self.status)
        Logger.info("GUI: %s", self.status)

        if self.data_source:
            self.clock_event = Clock.schedule_interval(self.loop, 0)

        return self.app

    def check_callback(self: DD, callback, data):
        """
        We mainthread this function so that someone with crazy toggle fingers
        doesn't beat the race condition.
        """
        ret = False

        try:
            # Check if any dynamic changes need to be made
            if libdigitaldash.check(
                float(data[callback.pid.value]), callback.value, callback.op
            ):
                ret = callback
        except Exception as e:
            Logger.error(
                "GUI: Firmware did not provide data value for key: %s",
                callback.pid.value,
            )

        return ret

    @mainthread
    def change(self: DD, app, my_callback) -> NoReturn:
        """
        This method only handles dynamic changing, the alert changing is handled in
        the main application loop.
        """
        self.current = my_callback.viewId
        my_callback.change(self)

    def update_values(self: DD, data: List[float]) -> NoReturn:
        for widget in self.objectsToUpdate:
            for obj in widget:
                if obj.pid:
                    try:
                        obj.setData(data[obj.pid.value])
                    except:
                        Logger.error(
                            "GUI: Firmware did not provide data value for key: %s",
                            obj.pid.value,
                        )
                else:
                    # This is for widgets that subscribe to
                    # updates but don't need any pid data ( Clock ).
                    obj.set_data(0)

    # TODO: Is there a big issue with mainthreading the whole loop?
    @mainthread
    def loop(self, dt):
        if self.first_iteration:
            self.first_iteration = False

        (my_callback, priority, data) = (
            None,
            0,
            dataSource.service(app=self, pids=self.pids),
        )

        # Buffer our alerts and dynamic updates
        if self.count > 8:
            dynamic_change = False
            # Check dynamic gauges before any alerts in case we make a change
            for dynamic in self.dynamic_callbacks:
                if self.current == dynamic.viewId:
                    pass
                else:
                    my_callback = self.check_callback(dynamic, data)

                if my_callback:
                    self.count = 0
                    self.change(self, my_callback)
                    dynamic_change = True
                    break

            # Check our alerts if no dynamic changes have occured
            if not dynamic_change:
                for callback in self.alert_callbacks:
                    my_callback = self.check_callback(callback, data)

                    if my_callback:
                        self.count = 0
                        if callback.parent is None:
                            self.alerts.add_widget(my_callback)
                    elif callback.parent:
                        self.alerts.remove_widget(callback)
        else:
            self.count = self.count + 1
        self.update_values(data)


if __name__ == "__main__":
    Logger.info(f"GUI: Running version: {__version__}")
    dd = GUI()

    dd.new(configFile=ConfigFile, data=dataSource)

    dd.run()
