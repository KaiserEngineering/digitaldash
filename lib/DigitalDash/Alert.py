"""Monitour a datapoint and create a alert if triggered."""

import DigitalDash
from kivy.properties import NumericProperty
from kivy.graphics import Color, Rectangle
from functools import lru_cache
from DigitalDash.Abstractor import MetaLabel
from DigitalDash.Abstractor import KELabel

from kivy.lang import Builder
Builder.load_string('''
<Alert>:
    ellipsis_options: {'color':(1,0.5,0.5,1),'underline':True}
    shorten: True
    markup: True
    shorten_from: 'right'
    size_hint: 0.4, 0.5
    pos_hint: {"center_x": 0.50, "center_y": 0.8}
    halign: 'center'
    valign: 'middle'
    canvas.before:
        Rectangle:
            id: 'Alert-'+str(self.message)
            size: self.size
            pos: self.pos
            source: 'static/imgs/Alerts/FordWarning.png'
''')
class Alert(KELabel):
    """
    Create an Alert label if triggered.
        :param Label: Kivy label class
    """

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
        super(Alert, self).__init__(args)
        self.value     = args['value']
        self.op        = args['op']
        self.index     = args['index']
        self.priority  = args['priority']
        self.dataIndex = int(args['dataIndex'])

    @lru_cache(maxsize=512)
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
        self.text = self.default
        return False
