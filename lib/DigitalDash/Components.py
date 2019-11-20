from lib.DigitalDash.Abstractor import Base, Needle
from kivy.properties import StringProperty, NumericProperty
from kivy.lang import Builder
from kivy.graphics import Color, Rectangle
from kivy.uix.stencilview import StencilView
from typing import NoReturn, List, TypeVar
from kivy.uix.image import AsyncImage
from kivy.uix.label import Label
from kivy.uix.widget import Widget

G = TypeVar('G', bound='Gauge')
class Gauge(Base, AsyncImage):
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
        self.id     = "Gauge-" + args.get('PID', '')

    def SetOffset(self: G) -> NoReturn:
        """Set offset for negative values"""
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0

    def SetStep(self: G) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self: G, path: str, args, themeArgs) -> NoReturn:
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs.get('degrees', 0)),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))


KL = TypeVar('KL', bound='KELabel')
class KELabel(Base, Label):
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
        self.id      = "Label-" + args.get('PID', '')

        if ( self.default == '__PID__' ):
            self.default = args.get('PID', '')
        self.text = self.default

        # Set position dynamically
        self.new_pos = list(map( lambda x: x / 100, args.get('pos', (0, 0)) ))

        self.font_size = args.get('font_size', 25)
        self.min = 9999
        self.max = -9999

        if ( args.get('data', False) ):
            self.dataIndex = args['dataIndex']

    def AttrChange(self):
        self.pos = (min(self.parent.size) * self.new_pos[0], min(self.parent.size) * self.new_pos[1])

    def setData(self: KL, value='') -> NoReturn:
        """
        Send data to Label widget.
        Check for Min/Max key words to cache values with regex checks.
            :param self: LabelWidget object
            :param value='': Numeric value for label
        """
        value   = float(value)
        default = ''
        if (self.default == 'Min: '):
            if (self.min > value):
                self.min = value
            value = self.min
        elif (self.default == 'Max: '):
            if (self.max < value):
                self.max = value
            value = self.max
        else:
            default = self.default
        self.text = default + "{0:.2f}".format(value)


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
class NeedleRadial(Needle, AsyncImage):
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
        self.degrees = 0
        self.id      = "Radial-Needle-" + args['PID']

        self.SetAttrs(path, args, themeArgs)
        self.update  = self.degrees / 2


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
            angle_end: self.angle_start + self.update
        StencilUse

        # Now we want to draw our gauge and crop it
        Ellipse:
            size: min(root.size), min(root.size)
            pos: self.width / 2 - min(self.size) / 2, self.height / 2 - min(self.size) / 2
            source: self.source
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update
        StencilUnUse

        # Redraw our stencil to remove it
        Ellipse:
            size: min(self.size), min(self.size)
            pos: self.width / 2 - min(self.size) / 2, self.height / 2 - min(self.size) / 2
            angle_start: self.angle_start
            angle_end: self.angle_start + self.update
        StencilPop
''')
class NeedleEllipse(Needle, Widget):
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
