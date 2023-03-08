"""Main start module"""

# We need to set OS envs before any Kivy widgets are called
# looking at you Test.
import os
import pathlib
WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())
os.environ["KIVY_HOME"] = WORKING_PATH + "/etc/kivy/"

# Comment the line below out to see logs in terminal
os.environ["KIVY_NO_CONSOLELOG"] = "1"

# Dependent modules and packages
import getopt
import sys
from digitaldash.test import Test
from typing import Optional, Union
from functools import lru_cache
from digitaldash.keProtocol import Serial

(TESTING, ConfigFile) = (False, None)
dataSource: Optional[Test | Serial] = None

opts, args = getopt.getopt(
    sys.argv[1:], "tdf:c:", ["test", "development", "file=", "config="]
)

sys.argv = ["main.py"]
for o, arg in opts:
    # Development mode runs with debug console - ctr + e to open it in GUI
    if o in ("-d", "--development"):
        sys.argv = ["main.py -m console"]
    elif o in ("-f", "--file"):
        dataSource = Test(file="tests/data/rpm_increasing.csv")
    elif o in ("-t", "--test"):
        TESTING = True
    elif o in ("-c", "--config"):
        ConfigFile = arg

# Our Kivy deps
from kivy.logger import Logger
from kivy.app import App
from kivy.lang import Builder
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.relativelayout import RelativeLayout
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
from kivy.uix.label import Label
from kivy.clock import mainthread, Clock

# Rust import
import libdigitaldash

from digitaldash.digitaldash import buildFromConfig, clearWidgets
from digitaldash.digitaldash import Alert, Dynamic
from digitaldash.keError import ConfigBuildError
from _version import __version__
from etc import config

config.setWorkingPath(WORKING_PATH)

if dataSource is None:
    try:
        dataSource = Serial()
        Logger.info("Using serial data source" + str(dataSource))
    except Exception as e:
        Logger.error("Running without serial data: " + str(e))


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
        try:
            buildFromConfig(self.DigitalDash, dataSource)
            if self.DigitalDash.data_source:
                self.DigitalDash.clock_event = Clock.schedule_interval(
                    self.DigitalDash.loop, 0
                )
        except ConfigBuildError as ex:
            Logger.error(f"GUI: {ex}")
            clearWidgets(self.DigitalDash)
            self.DigitalDash.app.add_widget(Label(text=str(ex)))

    @mainthread
    def on_modified(self, event):
        if hasattr(self.DigitalDash, "clock_event"):
            self.DigitalDash.clock_event.cancel()
        Clock.schedule_once(self.rebuild, 0)


# Load our KV files
for file in os.listdir(WORKING_PATH + "/digitaldash/kv/"):
    Builder.load_file(WORKING_PATH + "/digitaldash/kv/" + str(file))

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
    status: str

    def __init__(self, **args):
        super().__init__()
        self.configFile = args.get("configFile")
        self.jsonData = args.get("jsonData")
        self.WORKING_PATH = WORKING_PATH
        self.count = 0

    def new(self, configFile=None, data=None):
        """
        This method can be used to set any values before the app starts, this is useful for
        testing.
        """
        if configFile:
            self.configFile = configFile

        if data:
            global dataSource
            dataSource = data

    def remove_version_label(self, dt):
        """
        Remove the firmware/gui version label, this should be auto
        called with the clock schedule_once function.
        """
        Logger.info("GUI: Removing firmware/gui version label")
        self.app.remove_widget(self.version_label)

    def build(self):
        """Called at start of application"""

        # Our main application object
        self.app = AnchorLayout()

        self.data_source = dataSource
        self.working_path = WORKING_PATH

        observer = Observer()
        observer.schedule(
            MyHandler(self), WORKING_PATH + "/etc/", recursive=True
        )
        observer.start()

        try:
            buildFromConfig(self, dataSource)
        except ConfigBuildError as ex:
            Logger.error(f"GUI: {ex}")
            return Label(text=str(ex))

        if self.data_source:
            self.firmware_version = f"FW: {self.data_source.get_firmware_version()}"
            Logger.error(f"VERSION: {self.firmware_version}")
            self.clock_event = Clock.schedule_interval(self.loop, 0)
        else:
            self.firmware_version = "FW: N/A"
        self.gui_version = f"GUI: {__version__}"

        self.version_label = Label(text=f"{self.firmware_version} {self.gui_version}",pos=(0, 160))
        layout = RelativeLayout()
        layout.add_widget(self.version_label)
        self.app.add_widget(layout)

        return self.app

    @lru_cache(maxsize=128)
    def rust_check(self, value: float, callback: Union[Alert, Dynamic]):
        try:
            # Check if any dynamic changes need to be made
            if libdigitaldash.check(value, callback.value, callback.op):
                return callback
        except Exception as ex:
            # Check if this is the error config (i.e. PID = "n/a")
            # TODO: Do we need this any longer?
            if callback.pid.value == "n/a":
                Logger.error("GUI: Config file is invalid: %s", ex)
                return callback

            Logger.error(
                "GUI: Firmware did not provide data value for key: %s: %s",
                callback.pid.value,
                ex,
            )

    def check_callback(self, callback: Union[Alert, Dynamic], data: dict):
        """
        We mainthread this function so that someone with crazy toggle fingers
        doesn't beat the race condition.
        """
        try:
            return self.rust_check(float(data[callback.pid.value]), callback)
        except KeyError as ex:
            Logger.error(
                "GUI: Firmware did not provide expected data value: %s",
                ex,
            )
            return False

    @mainthread
    def change(self, app, my_callback):
        """
        This method only handles dynamic changing, the alert changing is handled in
        the main application loop.
        """
        self.current = my_callback.viewId
        my_callback.change(self)

    def update_values(self, data: dict[float]):
        for widget in self.objectsToUpdate:
            for obj in widget:
                if obj.pid:
                    try:
                        obj.setData(data[obj.pid.value])
                    except Exception:
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
    def loop(self, _dt: float):
        if self.first_iteration:
            self.first_iteration = False

        if dataSource is not None:
            (my_callback, data) = (
                None,
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
