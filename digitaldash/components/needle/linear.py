from kivy.uix.widget import Widget
from digitaldash.components.needle.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from kivy.uix.stencilview import StencilView
from typing import NoReturn, List, TypeVar

class NeedleLinear(Needle, StencilView):
    """
    Create Needle widget.

    Needle class is used to generate the needle for
    gauges. This class also has the **setData()**
    method, which can be called and update the needles
    angle value.

        :param MetaWidget: <DigitalDash.Components.NeedleLinear>
    """
    update = NumericProperty()
    source = StringProperty()
    step   = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleLinear, self).__init__()
        self.SetUp(**kwargs)
        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)
        self.Type = 'Linear'

    def _size(self, gauge):
        '''Helper method that runs when gauge face changes size.'''
        self.setStep()
        self.setData(self.true_value)

    def setStep(self) -> NoReturn:
        """Method for setting the step size for Linear needles."""
        self.step = self.width / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1.

    def SetOffset(self) -> NoReturn:
        """Set offset for negative values"""
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0