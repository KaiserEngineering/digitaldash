from kivy.uix.widget import Widget
from lib.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from kivy.uix.stencilview import StencilView
from typing import NoReturn
from kivy.core.window import Window

class NeedleLinear(Needle, StencilView):
    """Wrapper combining lib.needles.needle and kivy.uix.stencilview."""

    update  = NumericProperty()
    source  = StringProperty()
    step    = NumericProperty()
    xOffset = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleLinear, self).__init__()
        self.set_up(**kwargs)
        (self.r, self.g, self.b, self.a) = (1, 0, 0, 0.7)
        self.Type    = 'Linear'
        self.xOffset = 0

        # We need to bind here so that when the Linear gauge is added
        # to the parent layout and width value changes we update our step.
        def my_width_callback(obj, value):
            self.set_step()

        self.bind(width=my_width_callback)


    def set_step(self) -> NoReturn:
        """
        Method for setting the step size for Linear needles.

        Args:
          self <lib.needles.linear>
        """
        self.step = self.width / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1.
            
        if ( self.width == ( Window.width - 100 ) ):
            self.xOffset = 100

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
