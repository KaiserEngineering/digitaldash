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
import kivy
from kivy.clock import Clock
import KE
from kivy.app import App
from kivy.properties import StringProperty

from etc import Config
Config.SetWindow

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
                my_callback = None
                priority = 0
                data = Serial.serialLoop()

                for callback in self.callbacks:
                    if (self.current != callback.index and priority <= callback.priority and callback.check(data[callback.data])):
                        priority = callback.priority
                        my_callback = callback

                if(my_callback):
                    self.current = my_callback.index
                    my_callback.change(self, my_callback)
                    # We use blank here, because we want to keep our app instance alive
                    (blank, self.background, self.alerts, self.ObjectsToUpdate, self.WidgetsInstance, self.bytecode) = self.views[my_callback.index].values()

                    # Send update Matts way
                    Serial.updateSerial(self.bytecode)

                iterator, i = iter(data), 0
                for data in iterator:
                    widget = self.ObjectsToUpdate[i]
                    for obj in widget:
                        obj.setData(data)
                    i += 1
                    if (i >= len(self.ObjectsToUpdate)):
                        break

        self.current = 0
        self.views, self.containers, self.callbacks = KE.setup()
        (self.app, self.background, self.alerts, self.ObjectsToUpdate, self.WidgetsInstance, self.bytecode) = self.views[0].values()

        self.app.add_widget(self.containers[0])
        self.app.add_widget(self.alerts)

        Clock.schedule_interval(loop, 0)

        return self.app


DigitalDash().run()
