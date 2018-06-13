"""Monitour a datapoint and create a alert if triggered."""

import DigitalDash
from kivy.uix.label import Label
from kivy.properties import NumericProperty
from kivy.graphics import Color, Rectangle

class Alert(Label):
    """Create an Alert label if triggered."""

    posx = NumericProperty()
    posy = NumericProperty()

    def __init__(self, args):
            """Create Alert widget."""
            super(Alert, self).__init__()

            self.value       = args['value']
            self.op          = args['op']
            self.index       = args['index']
            self.priority    = args['priority']
            self.dataIndex   = int(args['dataIndex'])
            self.message     = args['message']

    def check(self, value):
        """Check logic here."""
        return (eval(str(value) + self.op + str(self.value)))

    def change(self, App, callback):
        """Perform view change."""

        self.text      =  self.message
        self.font_size = 30
        self.pos       = 100, 100

        # Return false if no new view is to be loaded
        return False
