"""Linear!"""
from kivy.properties import NumericProperty
from kivy.properties import StringProperty, ColorProperty
from kivy.uix.stencilview import StencilView
from kivy.core.window import Window
from digitaldash.needles.needle import Needle


class NeedleLinear(Needle, StencilView):
    """Wrapper combining digitaldash.needles.needle and kivy.uix.stencilview."""

    update = NumericProperty()
    source = StringProperty()
    step = NumericProperty()
    padding = NumericProperty()
    xOffset = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()
    color = ColorProperty(defaultvalue='#FF0000FF')

    def __init__(self, **kwargs):
        super(NeedleLinear, self).__init__()
        self.setUp(**kwargs)
        self.type = "Linear"
        self.padding = 100
        self.xOffset = self.padding

        # We need to bind here so that when the Linear gauge is added
        # to the parent layout and width value changes we update our step.
        def myWidthCallback(self, instance):
            self.setStep()

        self.bind(width=myWidthCallback)

    def setStep(self) -> None:
        """
        Method for setting the step size for Linear needles.

        Args:
          self <digitaldash.needles.linear>
        """
        self.step = (self.width - (self.padding*2)) / (abs(self.minValue) + abs(self.maxValue))
        if self.step == 0:
            self.step = 1.0

        if self.width == (Window.width - 100):
            self.xOffset = 100

        self.xOffset = (self.step * abs(self.minValue)) + self.padding

    def setOffset(self) -> None:
        """
        Set offset to 0, the offset of the starting point is handled in setStep

        Args:
          self <digitaldash.needles.linear>
        """
        self.offset = 0
