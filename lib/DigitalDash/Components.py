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

        :param MetaWidget: <DigitalDash.Components.Gauge>
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

        :param MetaWidget: <DigitalDash.Components.KELabel>
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
        if ( args['data'] ):
            self.dataIndex = args['dataIndex']


class NeedleRadial(MetaImage):
    """
    Create Needle widget.

    Needle class is used to generate the needle for
    gauges. This class also has the **setData()**
    method, which can be called and update the needles
    angle value.

        :param MetaWidget: <DigitalDash.Components.NeedleRadial>
    """

    update = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.SetAttrs(path, args, themeArgs)

        self.update = self.degrees / 2

    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """

        value = float(value)
        massager = Massager()
        val = 0

        if self.update == self.update:
            val = massager.Smooth({'Current': self.update, 'New': value})
        else:
            val = value

        self.update = -val * self.step + self.degrees / 2 + self.offset
        if value > self.max:
            self.update = -self.degrees / 2


class NeedleLinear(MetaWidget):
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
    step = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Create Linear Slider."""
        super(NeedleLinear, self).__init__()
        self.SetAttrs(path, args, themeArgs)
        self.bind(size=self.SizeUpdate)
        self.size_accounted = 0

        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)

    def SizeUpdate(self, *args):
        self.step = self.size[0] / (abs(self.min) + abs(self.max))

    def SetStep(self):
        self.step = self.parent.width / (abs(self.min) + abs(self.max))

    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """

        value = float(value)
        massager = Massager()
        val = 0

        if self.update == self.update:
            val = massager.Smooth({'Current': self.update, 'New': value})
        else:
            val = value

        if value > self.max:
            self.update = self.max - self.offset

        self.update = (val - self.offset) * self.step


class NeedleEllipse(MetaWidget):
    """
    Create Ellipse widget.

        :param MetaWidget: <DigitalDash.Components.NeedleEllipse>
    """
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

        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)
        self.angle_start = themeArgs['angle_start'] - 12

        self.SetOffset()

    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """

        value = float(value)
        massager = Massager()
        val = 0

        if self.update == self.update:
            val = massager.Smooth({'Current': self.update, 'New': value})
        else:
            val = value

        self.update = ( val - self.offset ) * float(self.step)
        if value > self.max:
            self.update = -self.degrees / 2
