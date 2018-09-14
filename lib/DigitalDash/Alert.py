"""Monitour a datapoint and create a alert if triggered."""

import DigitalDash
from kivy.uix.label import Label
from kivy.properties import NumericProperty
from kivy.graphics import Color, Rectangle

class Alert(Label):
    """
    Create an Alert label if triggered.
        :param Label: Kivy label class
    """

    posx = NumericProperty()
    posy = NumericProperty()

    def __init__(self, args):
        """
        Create Alert widget.
            :param self: KE Alert object
            :param args: {
                    value     : <Float>,
                    op        : <String>,
                    index     : <Int>,
                    priority  : <Int>,
                    dataIndex : <Int>,
                    message   : <String>,
                }
        """
            super(Alert, self).__init__()

            self.value       = args['value']
            self.op          = args['op']
            self.index       = args['index']
            self.priority    = args['priority']
            self.dataIndex   = int(args['dataIndex'])
            self.message     = args['message']

    def check(self, value):
        """
        Check logic here.
            :param self: Alert object
            :param value: value to check Alert condition against
        """
        return (eval(str(value) + self.op + str(self.value)))

    def change(self, App, callback):
        """
        Perform view change
            :param self: Alert object
            :param App: main application object
            :param callback: current callback object
        """
        self.text      =  self.message
        self.font_size = 30
        self.pos       = 100, 100

        # Return false if no new view is to be loaded
        return False
