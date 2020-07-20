"""Monitour a datapoint and create a alert if triggered."""
from kivy.properties import NumericProperty
from kivy.graphics import Color, Rectangle
from functools import lru_cache
from digitaldash.ke_lable import KELabel

class Alert(KELabel):
    """
    Create an Alert label if triggered.
        :param Label: Kivy label class
    """

    def __init__(self, **args):
        """
        Create Alert widget.
            :param self: KE Alert object
            :param args: {
                    value     : <Float>,
                    op        : <String>,
                    index     : <Int>,
                    priority  : <Int>,
                    pid       : <String>,
                    message   : <String>,
                }
        """
        super(Alert, self).__init__(**args)

        self.value     = args['value']
        self.op        = args['op']
        self.index     = int(args.get('index'))
        self.priority  = args['priority']
        self.pid       = args['pid']
        self.message   = str(args['message'])
        self.text      = self.message
        self.buffer    = 0

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
