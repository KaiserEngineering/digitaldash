"""Monitour a datapoint and create a alert if triggered."""
from digitaldash.keLabel import KELabel
from digitaldash.base import convertOpToBytes


class Alert(KELabel):
    """
    Wrapper on digitaldash.ke_label that adds method for checking
    when the label should be displayed.
    """

    # pylint: disable=too-many-instance-attributes

    def __init__(self, **args):
        """
        Args:
          self (<digitaldash.alert>)
          value (Float)  : value to compare pid value against
          op (str)       : Operator for comparison
          viewId (int)   : View id that this alert is bound to
          priority (int) : Determines which alert is shown if multiple are true at once
          pid (str)      : Byte code value of PID to check value of
          message (str)  : Message to show on label
        """
        super().__init__(**args)

        self.value = float(args["value"])

        convertOpToBytes(self, args)

        self.viewId = int(args.get("viewId"))
        self.priority = args["priority"]
        self.pid = args["pid"]
        self.message = str(args["message"])
        self.text = self.message
        self.buffer = 0

    def setPos(self, **args):
        self.pos = (self.center_x + self.width / 4, self.center_y + self.height / 1.5)
