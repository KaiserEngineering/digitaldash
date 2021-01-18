"""Monitour a datapoint and create a alert if triggered."""
from functools import lru_cache
import ast
from lib.ke_label import KELabel

class Alert(KELabel):
    """
    Wrapper on digitaldash.ke_label that adds method for checking
    when the label should be displayed.
    """

    def __init__(self, **args):
        """
        Args:
          self (<digitaldash.alert>)
          value (Float)  : value to compare pid value against
          op (str)       : Operator for comparison
          index (int)    : View id that this alert is bound to
          priority (int) : Determines which alert is shown if multiple are true at once
          pid (str)      : Byte code value of PID to check value of
          message (str)  : Message to show on label
        """
        super(Alert, self).__init__(**args)

        self.value = float(args['value'])

        if ( len(args.get('op')) == 2 ):
            operator = bytearray( args.get('op').encode() )
            self.op  = (operator[0] << 8) | (operator[1] & 0xFF)
        else:
            operator = " "+str(args.get('op'))
            operator = bytearray( operator.encode() )
            self.op  = (operator[0] << 8) | (operator[1] & 0xFF)

        self.index = int(args.get('index'))
        self.priority = args['priority']
        self.pid = args['pid']
        self.message = str(args['message'])
        self.text = self.message
        self.buffer = 0

    def set_pos(self, **args):
      self.pos = (self.center_x + self.width / 4, self.center_y + self.height / 1.5)
