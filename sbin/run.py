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

path_regex = re.compile('(.+)\/run\.py')
path = path_regex.findall(os.path.abspath( __file__ ))[0]

sys.path.append(os.path.join(path, '../'))
sys.path.append(os.path.join(path, '../lib'))
sys.path.append(os.path.join(path, '../etc'))
sys.path.append(os.path.join(path, '../KE'))

from DigitalDash.Test import Test
from typing import NoReturn, List, TypeVar

import getopt
run = False
Data_Source = 0

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

try:
    import Serial
    serial = True
    Data_Source = Serial.Serial()
    print("Using serial data source" + str(Data_Source))
except Exception as e:
    print("Running without serial data: " + str(e))
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
        def loop(dt):
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
        # END LOOP


        # Our main application object
        self.app = AnchorLayout()

        self.current = 0
        (self.views, self.containers, self.callbacks) = KE.setup()

        (self.background, self.background_source, self.alerts, self.ObjectsToUpdate, self.pids) = self.views[0].values()

        # Send our PIDs to the micro
        if ( Data_Source ):
            Data_Source.UpdateRequirements(self.pids)

            self.data_source = Data_Source

        self.app.add_widget(self.background)
        self.background.add_widget(self.containers[0])
        self.background.add_widget(self.alerts)

        # We concider program start a config change since it is just loading
        # data from the config file
        on_config_change(self)
        Clock.schedule_interval(loop, 0.05)

        observer = Observer()
        observer.schedule(MyHandler(self), 'etc/', recursive=True)
        observer.start()

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

# FIXME Move Linear gauge up on Y-Axis to compensate for enclosure screen cut-off
# TODO Add logging
