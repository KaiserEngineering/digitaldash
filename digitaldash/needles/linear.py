from kivy.uix.widget import Widget
from digitaldash.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from kivy.uix.stencilview import StencilView
from typing import NoReturn

class NeedleLinear(Needle, StencilView):
    """Wrapper combining digitaldash.needles.needle and kivy.uix.stencilview."""

    update = NumericProperty()
    source = StringProperty()
    step   = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleLinear, self).__init__()
        self.set_up(**kwargs)
        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)
        self.Type = 'Linear'

    def _size(self, gauge) -> NoReturn:
        """
        Helper method that runs when gauge face changes size.

        Args:
          self (<digitaldash.needles.linear>)
          gauge (<digitaldash.gauge) : Base needle size off the size of the rest of
            the gauge
        """
        self.setStep()
        self.setData(self.true_value)

    def set_step(self) -> NoReturn:
        """
        Method for setting the step size for Linear needles.

        Args:
          self <digitaldash.needles.linear>
        """
        self.step = self.width / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1.

    def set_offset(self) -> NoReturn:
        """
        Set offset for negative values or 0 for strictly positive PIDs

        Args:
          self <digitaldash.needles.linear>
        """
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0
