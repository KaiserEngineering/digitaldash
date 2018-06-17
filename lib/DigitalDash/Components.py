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
    """

    update = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.source = path + 'needle.png'
        self.step = float(themeArgs['degrees']) /  (abs(float(args['MinMax'][1])) + abs(float(args['MinMax'][0])))
        self.degrees = float(themeArgs['degrees'])
        self.update = self.degrees / 2

        # To handle negative values
        if ( args['MinMax'][0] < 0 ):
            self.offset = args['MinMax'][0] * self.step
        else:
            self.offset = 0


class NeedleLinear(MetaWidget):
    """
    Create Needle widget.

    Needle class is used to generate the needle for
    gauges. This class also has the **setData()**
    method, which can be called and update the needles
    angle value.
    """

    update = NumericProperty()
    source = StringProperty()
    steps   = NumericProperty()
    r      = NumericProperty()
    g      = NumericProperty()
    b      = NumericProperty()
    a      = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Create Linear Slider."""
        super(NeedleLinear, self).__init__()
        self.source = path + 'needle.png'
        self.steps = abs(args['MinMax'][0] - args['MinMax'][1])
        (self.r, self.g, self.b, self.a) = (0, 0, 255, 1)

        if ( args['MinMax'][0] < 0 ):
            self.offset = args['MinMax'][0] * self.step
        else:
            self.offset = 0


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
        self.source = path + 'needle.png'
        self.step = themeArgs['degrees'] / abs(args['MinMax'][0] - args['MinMax'][1])
        (self.r, self.g, self.b, self.a) = (0, 0, 255, 1)
        self.angle_start = themeArgs['angle_start']
        self.update = self.angle_start

        if ( args['MinMax'][0] < 0 ):
            self.offset = args['MinMax'][0] - self.angle_start
        else:
            self.offset = 0 - self.angle_start
