from DigitalDash.Abstractor import *
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
import re
from kivy.lang import Builder

class Gauge(MetaImage):
    """
    Create Gauge widget.

    Gauge class will return Kivy Image for the face of
    the gauge. Requires one argument of a path to the
    image dir, where **gauge.png** should be stored.

        :param MetaWidget:
    """

    def __init__(self, path):
        """Initite Gauge Widget."""
        super(Gauge, self).__init__()
        self.source = path + 'gauge.png'


class KELabel(MetaLabel):
    """
    Create Label widget.

    Send a default value that will stay with the Label
    at all times 'default'.

        :param MetaWidget:
    """

    def __init__(self, args):
        """Intiate Label widget."""
        super(KELabel, self).__init__()
        self.default = args.get('default', '')
        self.text = self.default
        self.pos = args.get('pos', self.pos)
        self.font_size = args.get('font_size', 25)
        self.min = 9999
        self.max = -9999


class NeedleRadial(MetaImage):
    """
    Create Needle widget.

    Needle class is used to generate the needle for
    gauges. This class also has the **setData()**
    method, which can be called and update the needles
    angle value.

        :param MetaWidget:
    """

    update = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.SetAttrs(path, args, themeArgs)

        self.update = self.degrees / 2


class NeedleLinear(MetaWidget):
    """
    Create Needle widget.

    Needle class is used to generate the needle for
    gauges. This class also has the **setData()**
    method, which can be called and update the needles
    angle value.
        :param MetaWidget:
    """
    update = NumericProperty()
    source = StringProperty()
    steps  = NumericProperty()
    r      = NumericProperty()
    g      = NumericProperty()
    b      = NumericProperty()
    a      = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Create Linear Slider."""
        super(NeedleLinear, self).__init__()
        self.SetAttrs(path, args, themeArgs)

        self.steps = abs(self.max - self.min)
        (self.r, self.g, self.b, self.a) = (0, 0, 255, 1)


class NeedleEllipse(MetaWidget):
    update = NumericProperty()
    source = StringProperty()
    degrees = NumericProperty()

    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()
    angle_start = NumericProperty()

    def __init__(self, path, args, themeArgs):
        super(NeedleEllipse, self).__init__()
        self.SetAttrs(path, args, themeArgs)

        (self.r, self.g, self.b, self.a) = (0, 0, 255, 1)
        self.angle_start = themeArgs['angle_start'] - 12

        self.SetOffset()
