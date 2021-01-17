from kivy.uix.widget import Widget
from lib.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from kivy.uix.stencilview import StencilView
from typing import NoReturn

class NeedleLinear(Needle, StencilView):
    """Wrapper combining lib.needles.needle and kivy.uix.stencilview."""

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

    def set_step(self) -> NoReturn:
        """
        Method for setting the step size for Linear needles.

        Args:
          self <lib.needles.linear>
        """
        self.step = (self.width * 2) / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1.

    def set_offset(self) -> NoReturn:
        """
        Set offset for negative values or 0 for strictly positive PIDs

        Args:
          self <lib.needles.linear>
        """
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0
