#!/usr/bin/env python
"""
Main file to start KE DigitalDash.

Run python3.6 sbin/run.py to run GUI software.
"""

import sys
import os
sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/lib')
sys.path.append(os.getcwd() + '/etc')
sys.path.append(os.getcwd() + '/KE')

import getopt
run = False

opts, args = getopt.getopt(sys.argv[1:],"td",["test", "development"])

for opt, arg in opts:
    # test mode will not run GUI
    if ( opt == '--test' or opt == '-t'):
        run = False
        sys.argv = ['sbin/run.py']
    # Development mode runs with debug console - ctr + e to open it in GUI
    elif ( opt == '--development' or opt == '-d'  ):
        run = True
        sys.argv = ['sbin/run.py -m console']
    else:
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
except Exception as e:
    serial = False


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
            if (serial):
                ( my_callback, priority, data ) = ( None, 0, Serial.serialLoop() )
                for callback in self.callbacks:
                    my_callback = self.check_callbacks(callback, priority, data)

                    if(my_callback):
                        self.check_change(self, my_callback)

                self.update_values(data)
        # END LOOP

        self.current = 0
        self.views, self.containers, self.callbacks = KE.setup()
        (self.app, self.background, self.alerts, self.ObjectsToUpdate, self.WidgetsInstance, self.bytecode) = self.views[0].values()

        self.app.add_widget(self.containers[0])
        self.app.add_widget(self.alerts)

        Clock.schedule_interval(loop, 0)

        return self.app

    def check_callbacks(self, callback, priority, data):
    # Check if any dynamic changes need to be made
        if ( callback.check(data[callback.dataIndex]) ):
            if (self.current != callback.index and priority <= callback.priority):
                priority = callback.priority
                return callback

        # Clear alert widgets so we don't end up with multiple parent error
        elif type(callback) is Alert:
            self.alerts.remove_widget(callback)
            priority = 0
        else:
            priority = 0

        return False

    def check_change(self, app, my_callback):
    # We use blank here, because we want to keep our app instance alive
        if ( my_callback.change(self, my_callback) ):
            self.current = my_callback.index
            (blank, self.background, self.alerts, self.ObjectsToUpdate, self.WidgetsInstance, self.bytecode) = self.views[self.current].values()
            self.app.add_widget(self.alerts)

        elif type(my_callback) is Alert and my_callback.parent is None:
            self.alerts.add_widget(my_callback)

    def update_values(self, data):
        iterator, i = iter(data), 0
        for data in iterator:
            widget = self.ObjectsToUpdate[i]
            for obj in widget:
                obj.setData(data)
            i += 1
            if (i >= len(self.ObjectsToUpdate)):
                break

if ( run ):
    DigitalDash().run()
