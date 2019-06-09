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

    def __init__(self, path, args):
        """Initite Gauge Widget."""
        super(Gauge, self).__init__()
        self.source = path + 'gauge.png'
        self.id = "Gauge-" + args.get('PID', '')

class KELabel(MetaLabel):
    """
    Create Label widget.

    Send a default value that will stay with the Label
    at all times 'default'.

        :param MetaWidget: <DigitalDash.Components.KELabel>

    If default value of label is set to '__PID__' then that string will
    be replaced with the PID name for the data index the label is for.
    """

    def __init__(self, args):
        """Intiate Label widget."""
        super(KELabel, self).__init__()
        self.default = args.get('default', '')
        self.id = "Label-" + args.get('PID', '')

        if ( self.default == '__PID__' ):
            self.default = args.get('PID', '')

        self.text = self.default
        self.pos = args.get('pos', self.pos)
        self.font_size = args.get('font_size', 25)
        self.min = 9999
        self.max = -9999

        if ( args.get('data', False) ):
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
        self.id = "Radial-Needle-" + args['PID']
        self.update = self.degrees / 2

    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """
        value = float(value)

        if value > self.max:
            self.update = -self.degrees / 2
        elif value < self.min:
            self.update = abs(self.min) * float(self.step) + (self.offset * self.step) + self.degrees / 2
        else:
            self.update = -value * float(self.step) + (self.offset * self.step) + self.degrees / 2

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
    step   = NumericProperty()
    r = NumericProperty()
    g = NumericProperty()
    b = NumericProperty()
    a = NumericProperty()

    def __init__(self, path, args, themeArgs):
        """Create Linear Slider."""
        super(NeedleLinear, self).__init__()
        self.SetAttrs(path, args, themeArgs)
        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)
        self.id = "Linear-Needle-" + args['PID']

    def AttrChange(self):
        self.SetStep()

    def SetStep(self):
        self.step = self.parent.width / (abs(self.min) + abs(self.max))

Builder.load_string('''
<NeedleEllipse>:
    canvas:
        # Draw our stencil
        StencilPush
        Ellipse:
            size: min(root.size), min(root.size)
            pos: self.width / 2 - min(self.size) / 2, self.height / 2 - min(self.size) / 2
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update + 12
        StencilUse

        # Now we want to draw our gauge and crop it
        Ellipse:
            size: min(root.size), min(root.size)
            pos: self.width / 2 - min(self.size) / 2, self.height / 2 - min(self.size) / 2
            source: self.source
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update + 12
        StencilUnUse

        # Redraw our stencil to remove it
        Ellipse:
            size: min(self.size), min(self.size)
            pos: self.width / 2 - min(self.size) / 2, self.height / 2 - min(self.size) / 2
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update + 12
        StencilPop
''')
class NeedleEllipse(MetaWidget):
    """
    Create Ellipse widget.

        :param MetaWidget: <DigitalDash.Components.NeedleEllipse>
    """
    update       = NumericProperty()
    source       = StringProperty()
    degrees      = NumericProperty()
    angle_start  = NumericProperty()

    def __init__(self, path, args, themeArgs):
        super(NeedleEllipse, self).__init__()
        self.SetAttrs(path, args, themeArgs)
        self.id = "Ellipse-Needle-" + args['PID']

        self.angle_start = themeArgs['angle_start']
        self.SetOffset()
