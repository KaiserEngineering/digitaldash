#!/usr/bin/env python
"""
Main file to start KE DigitalDash.

Run python3.6 sbin/run.py to run GUI software.
"""

import sys
import os
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
import re

path_regex = re.compile('(.+)\/sbin\/run\.py')
path = path_regex.findall(os.path.abspath( __file__ ))[0]
print("Using working directory: " + path)

os.chdir(path)
sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/lib')
sys.path.append(os.getcwd() + '/etc')
sys.path.append(os.getcwd() + '/KE')
os.environ["KIVY_HOME"] = os.getcwd() + "/etc/kivy/"

from typing import NoReturn, List, TypeVar

import getopt
run = False
Data_Source = 0

from DigitalDash.Test import Test
opts, args = getopt.getopt(sys.argv[1:],"tdf:",["test", "development", "file"])
for opt, arg in opts:
    # test mode will not run GUI
    if ( opt == '--test' or opt == '-t'):
        run = False
        sys.argv = ['sbin/run.py']
    # Development mode runs with debug console - ctr + e to open it in GUI
    elif ( opt == '--development' or opt == '-d'  ):
        run = True
        sys.argv = ['sbin/run.py -m console']
    if ( opt == '--file' or opt == '-f' ):
        Data_Source = Test({'file': arg})

if not len(opts):
    sys.argv = ['sbin/run.py']
    run = True

from etc import Config

import kivy
from kivy.clock import Clock
import KE
from kivy.app import App
from kivy.properties import StringProperty
from DigitalDash.Alert import Alert
from kivy.uix.anchorlayout import AnchorLayout
from kivy.logger import Logger

try:
    import Serial
    serial = True
    Data_Source = Serial.Serial()
    Logger.info("Using serial data source" + str(Data_Source))
except Exception as e:
    Logger.info("Running without serial data: " + str(e))
    serial = False

def on_config_change(self):
        """
        Method for reloading config data.
        """
        (self.views, self.containers, self.callbacks) = KE.setup()
        self.app.clear_widgets()

        (self.background, self.background_source, self.alerts, self.ObjectsToUpdate, self.pids) = self.views[0].values()

        self.app.add_widget(self.background)
        self.background.add_widget(self.containers[0])
        self.background.add_widget(self.alerts)

class MyHandler(PatternMatchingEventHandler):
    """
    Class that handles file watchdog duties.
    """
    def __init__(self, DigitalDash):
        super(MyHandler, self).__init__()
        self.DigitalDash = DigitalDash


    patterns = ["*.json", "*.py"]

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


DD = TypeVar('DD', bound='DigitalDash')
class DigitalDash(App):
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

    def build(self):
        """Perform main build loop for Kivy app."""
        errors_seen = {}
        def loop(dt):
            try:
                if (Data_Source):
                    # NOTE Does the start command need to be outside of this loop?
                    ( my_callback, priority, data ) = ( None, 0, Data_Source.Start() )
                    # Check dynamic gauges before any alerts in case we make a change
                    for dynamic in sorted(self.callbacks['dynamic'], key=lambda x: x.priority, reverse=True):
                        my_callback = self.check_callback(dynamic, priority, data)

                        if(my_callback):
                            if self.current == dynamic.index:
                                break
                            self.change(self, my_callback)
                            break

                    for callback in sorted(self.callbacks[self.current], key=lambda x: x.priority, reverse=True):
                        my_callback = self.check_callback(callback, priority, data)

                        if(my_callback):
                            self.change(self, my_callback)
                            break

                    self.update_values(data)
            except Exception as e:
                e = str(e)
                Logger.error("["+str(dt)+"] Error found in main application loop: " +e)
                if e in errors_seen:
                    errors_seen[e] = errors_seen[e] + 1
                else:
                    errors_seen[e] = 1

                if errors_seen[e] >= 3:
                    (ret, msg) = Data_Source.PowerCycle()
                    if ( not ret ):
                        Logger.error( msg )
        # END LOOP

        # Our main application object
        self.app = AnchorLayout()

        self.current = 0
        (self.views, self.containers, self.callbacks) = KE.setup()

        (self.background, self.background_source, self.alerts, self.ObjectsToUpdate, self.pids) = self.views[0].values()

        # Send our PIDs to the micro
        if ( Data_Source and type(Data_Source) != Test ):
            #Initialize our hardware set-up and verify everything is peachy
            (ret, msg) = Data_Source.InitializeHardware();

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

        self.app.add_widget(self.background)
        self.background.add_widget(self.containers[0])
        self.background.add_widget(self.alerts)

        # We consider program start a config change since it is just loading
        # data from the config file
        on_config_change(self)
        Clock.schedule_interval(loop, 0)

        observer = Observer()
        observer.schedule(MyHandler(self), 'etc/', recursive=True)
        observer.start()

        # After we intialize we can send our requirements list
        (ret, msg) = Data_Source.UpdateRequirements(self.pids)
        if ( not ret ):
            Logger.error(msg)

        return self.app

    def check_callback(self: DD, callback, priority, data):
        # Check if any dynamic changes need to be made
        if ( callback.check(data[callback.dataIndex]) ):
            if (self.current != callback.index):
                if type(callback) is Alert:
                    self.alerts.clear_widgets()
            return callback

        # Clear alert widgets so we don't end up with multiple parent error
        if type(callback) is Alert:
            self.alerts.clear_widgets()

        return False

    def change(self: DD, app, my_callback) -> NoReturn:
        if ( my_callback.change(self, my_callback) ):
            self.current = my_callback.index
        elif type(my_callback) is Alert and my_callback.parent is None:
            self.alerts.add_widget(my_callback)

    def update_values(self: DD, data: List[float]) -> NoReturn:
        for widget in self.ObjectsToUpdate:
            for obj in widget:
                obj.setData(data[obj.dataIndex])

if ( run ):
    DigitalDash().run()
