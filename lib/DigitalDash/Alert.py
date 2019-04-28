"""Monitour a datapoint and create a alert if triggered."""

import DigitalDash
from kivy.uix.label import Label
from kivy.properties import NumericProperty
from kivy.graphics import Color, Rectangle

from kivy.lang import Builder
Builder.load_string('''
<Alert>:
    canvas.before:
        Rectangle:
            id: 'Alert-'+str(self.message)
            pos: (self.center_x - ( self.width / 4. ), self.center_y - (self.height / 4))
            size: self.width / 2, self.height / 2.
            source: 'static/imgs/Alerts/fordWarning.png'
''')

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

        self.value     = args['value']
        self.op        = args['op']
        self.index     = args['index']
        self.priority  = args['priority']
        self.dataIndex = int(args['dataIndex'])
        self.message   = args['message']

    def check(self, value:float) -> bool:
        """
        Check logic here.
            :param self: Alert object
            :param value: value to check Alert condition against
        """
        if value == value:
            return (eval(str(value) + self.op + str(self.value)))
        return 0

    def change(self, App, callback) -> bool:
        """
        Perform view change
            :param self: Alert object
            :param App: main application object
            :param callback: current callback object
        """
        self.text = self.message
        self.font_size = 60

        return False
