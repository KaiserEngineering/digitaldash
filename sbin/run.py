#!/usr/bin/env python
"""
Main file to start KE DigitalDash.

Run python3.6 sbin/run.py to run GUI software.
"""

import sys
import os
import _thread
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler
sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/lib')
sys.path.append(os.getcwd() + '/etc')
sys.path.append(os.getcwd() + '/KE')

from DigitalDash.Test import Test

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

try:
    import Serial
    serial = True
    Data_Source = Serial()
except Exception as e:
    serial = False

def on_config_change(self):
        """
        Method for reloading config data.
        """
        (self.views, self.containers, self.callbacks) = KE.setup()
        self.app.clear_widgets()
        self.background = ''

        (blank, self.background, self.alerts, self.ObjectsToUpdate) = self.views[0].values()

        self.app.add_widget(self.containers[0])
        self.app.add_widget(self.alerts)


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

    background = StringProperty()

    def build(self):
        """Perform main build loop for Kivy app."""
        def loop(dt):
            if (Data_Source):
                ( my_callback, priority, data ) = ( None, 0, Data_Source.Start() )

                # Check dynamic gauges before any alerts in case we make a change
                for dynamic in self.callbacks['dynamic']:
                        my_callback = self.check_callback(dynamic, priority, data)

                        if(my_callback):
                            self.change(self, my_callback)

                for callback in self.callbacks[self.current]:
                    my_callback = self.check_callback(callback, priority, data)

                    if(my_callback):
                        self.change(self, my_callback)

                self.update_values(data)
        # END LOOP

        self.current = 0
        (self.views, self.containers, self.callbacks) = KE.setup()

        (self.app, self.background, self.alerts, self.ObjectsToUpdate) = self.views[0].values()

        self.app.add_widget(self.containers[0])
        self.app.add_widget(self.alerts)

        # We concider program start a config change since it is just loading
        # data from the config file
        on_config_change(self)
        Clock.schedule_interval(loop, 0)

        observer = Observer()
        observer.schedule(MyHandler(self), 'etc/')
        observer.start()

        return self.app

    def check_callback(self, callback, priority, data):
    # Check if any dynamic changes need to be made
        if ( callback.check(data[callback.dataIndex]) ):
            if (self.current != callback.index and priority <= callback.priority):
                priority = callback.priority
                return callback

        # Clear alert widgets so we don't end up with multiple parent error
        elif type(callback) is Alert:
            self.alerts.remove_widget(callback)

        priority = 0

        return False

    def change(self, app, my_callback):
    # We use blank here, because we want to keep our app instance alive
        if ( my_callback.change(self, my_callback) ):
            self.current = my_callback.index
            (blank, self.background, self.alerts, self.ObjectsToUpdate) = self.views[self.current].values()
            self.app.add_widget(self.alerts)

        elif type(my_callback) is Alert and my_callback.parent is None:
            self.alerts.add_widget(my_callback)

    def update_values(self, data):
        for widget in self.ObjectsToUpdate:
            for obj in widget:
                obj.setData(data[obj.dataIndex])

if ( run ):
    DigitalDash().run()
