from DigitalDash.Abstractor import *
from kivy.properties import StringProperty, NumericProperty
import re
from kivy.lang import Builder
from kivy.graphics import Color, Rectangle
from kivy.uix.stencilview import StencilView

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
        self.text = self.default if self.default != 'Min' or self.default != 'Max' else ''
        self.pos = args.get('pos', self.pos)
        self.font_size = args.get('font_size', 25)
        self.min = 9999
        self.max = -9999
        if ( args['data'] ):
            self.dataIndex = args['dataIndex']

Builder.load_string('''
<NeedleRadial>:
    canvas.before:
        PushMatrix
        Translate:
            xy: (self.x + self.width / 2, self.y + self.height / 2)
        Rotate:
            angle: self.update
            axis: (0, 0, 1.0)
        Translate:
            xy: (-self.x - self.width / 2, - self.y - self.height / 2)
    canvas.after:
        PopMatrix
''')
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

Builder.load_string('''
<NeedleLinear>:
    canvas:
        # Draw our stencil
        StencilPush
        Rectangle:
            pos: self.x, root.center_y - self.height / 1.5
            size: self.update, 1000
        StencilUse
        # Now we want to draw our gauge and crop it
        Color:
            rgba: self.r, self.g, self.b, self.a
        Rectangle:
            size: self.width, self.height + self.height / 2
            pos: self.x, root.center_y - self.height / 1.5
            source: self.source
        StencilUnUse

        # Redraw our stencil to remove it
        Rectangle:
            pos: self.x, root.center_y - self.height / 1.5
            size: self.update, 10000
        StencilPop
''')
class NeedleLinear(StencilView, MetaWidget):
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

        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)

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

Builder.load_string('''
<NeedleEllipse>:
    canvas:
        # Draw our stencil
        StencilPush
        Ellipse:
            pos: self.x + (self.width - self.height) / 2, self.y
            size: self.height, self.height
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update + 12
        StencilUse
        # Now we want to draw our gauge and crop it
        Color:
            rgba: self.r, self.g, self.b, self.a
        Ellipse:
            size: self.height, self.height
            pos: self.x + (self.width - self.height) / 2, self.y
            source: self.source
            angle_start: 360
            angle_end: 0
        StencilUnUse

        # Redraw our stencil to remove it
        Ellipse:
            pos: self.x + (self.width - self.height) / 2, self.y
            size: self.height, self.height
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update + 12
        StencilPop
''')
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
    max         = NumericProperty()

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

        # ! TODO Massager
        # if self.update == self.update:
        #     val = massager.Smooth({'Current': self.update, 'New': value})
        # else:
        val = value

        self.update = ( val - self.offset ) * float(self.step)
        if value > self.max:
            self.update = -self.degrees / 2
