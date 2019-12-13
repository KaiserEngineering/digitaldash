"""Abstract classes."""
from kivy.properties import StringProperty, NumericProperty
from kivy.lang import Builder
from kivy.graphics import Color, Rectangle
from kivy.uix.stencilview import StencilView
from typing import NoReturn, List, TypeVar
from kivy.uix.image import AsyncImage
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.uix.relativelayout import RelativeLayout
from etc import Config
from typing import NoReturn, List, TypeVar
from kivy.uix.boxlayout import BoxLayout
from kivy.animation import Animation


class Base(object):
    def __init__(self):
        super(Base, self).__init__()
        # Our required attributes
        self.liveWidgets = []
        self.dataIndex   = -1
        self.Layout      = RelativeLayout()
        self.container   = None

        # Optional values
        self.minObserved      = 9999
        self.maxObserved      = -9999

    def AttributeChanged(self):
        for child in self.children:
            self.AttributeChanged(child)
        self.AttrChange()

    def AttrChange(self):
        pass

    def SetStep(self) -> NoReturn:
        """Method for setting the step size for rotation/moving widgets."""
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, *args) -> NoReturn:
        pass


class Needle(Base):

    def AttrChange(self):
        self.SetStep()
        self.SetOffset()

    def SetOffset(self) -> NoReturn:
        if (self.min < 0):
            self.offset = self.degrees / 2 - ( self.min * self.step )
        else:
            self.offset = self.degrees / 2
        self.setData(50)

    def SetStep(self) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, themeConfig={'degrees': 0, 'MinMax': [-9999, 9999]}, path='', **args) -> NoReturn:
        """Set basic attributes for widget."""

        (self.source, self.degrees, self.min, self.max) = (
            path + 'needle.png',
            float(themeConfig.get('degrees', 0)),
            themeConfig['MinMax'][0],
            themeConfig['MinMax'][1]
        )

    def setData(self, value=0) -> NoReturn:
        """
        Abstract setData method most commonly used.
            :param self: Widget Object
            :param value: Update value for gauge needle
        """
        value = float(value)

        if value > self.max:
            value = self.max / self.step
        elif value < self.min:
            value = self.min / self.step
        self.update = value * self.step - self.offset


class AbstractWidget(Base):
    """
    Generic scaffolding for KE Widgets.
        :param object: 
    """

    def build(self,
                container=BoxLayout(padding=(30, -70, 30, 0)),
                **ARGS
            ):
        """
        Create widgets for Dial.
            :param **ARGS:
        """
        args = {}

        self.container   = container
        self.Layout      = RelativeLayout()

        args['PID']  = ARGS['pids'][ARGS['dataIndex']]
        args['path'] = ARGS['path']

        self.Layout.id = "Widgets-Layout-" + args['PID']

        def ChangeAttr(self, _instance):
            for child in self.children:
                child.AttributeChanged()

        # This handles updating sizing when a widget is added to the layout after this one is initally added
        self.Layout.bind(size=ChangeAttr, pos=ChangeAttr)

        # Import theme specifc Config
        themeConfig = Config.getThemeConfig(ARGS['module'] + '/' + ARGS['args']['themeConfig'])
        args['themeConfig'] = {**ARGS['args'], **themeConfig}

        gauge = Gauge(**args)
        if gauge._coreimage:
            self.Layout.add_widget(gauge)

        needle = globals()['Needle' + ARGS['module']](**args)
        # Add widgets to our RelativeLayout
        self.Layout.add_widget(needle)

        # This normalizes our canvas needle sizes
        def _size(instance, size):
            (needle.sizex, needle.sizey) = gauge.norm_image_size
        gauge.bind(size=_size)
        (needle.sizex, needle.sizey) = gauge.norm_image_size

        needle.dataIndex = ARGS['dataIndex']
        # Adding widgets that get updated with data
        self.liveWidgets.append(needle)

        labels = []
        # Create our labels
        for labelConfig in themeConfig['labels']:
            labelConfig['dataIndex'] = ARGS['dataIndex']
            labelConfig['PID'] = ARGS['pids'][ARGS['dataIndex']]

            # Create Label widget
            label = KELabel(**labelConfig)
            labels.append(label)

            # Add to data recieving widgets
            if (labelConfig['data']):
                self.liveWidgets.append(label)

            self.Layout.add_widget(label)

        self.container.add_widget(self.Layout)

        return self.liveWidgets


G = TypeVar('G', bound='Gauge')
class Gauge(Base, AsyncImage):
    """
    Create Gauge widget.

    Gauge class will return Kivy Image for the face of
    the gauge. Requires one argument of a path to the
    image dir, where **gauge.png** should be stored.

        :param MetaWidget: <DigitalDash.Components.Gauge>
    """

    def __init__(self, **args):
        """Initite Gauge Widget."""
        super(Gauge, self).__init__()
        self.source    = args.get('path', '') + 'gauge.png'
        self.id        = "Gauge-" + args.get('PID', '')
        self.size_hint = (1, 1)
        self.pos       = (0, 0)

    def SetOffset(self: G) -> NoReturn:
        """Set offset for negative values"""
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0

    def SetStep(self: G) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))


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

    def __init__(self, **args):
        """Intiate Label widget."""
        super(KELabel, self).__init__()
        self.default         = args.get('default', '')
        self.id              = "Label-" + args.get('PID', '')
        self.ConfigColor     = args.get('color', (1, 1, 1 ,1)) # White
        self.color           = self.ConfigColor
        self.ConfigFontSize  = args.get('font_size', 25)
        self.font_size       = self.ConfigFontSize

        if ( self.default == '__PID__' ):
            self.default = args.get('PID', '')
        self.text = self.default

        # Set position dynamically
        self.new_pos = list(map( lambda x: x / 100, args.get('pos', (0, 0)) ))

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
        value = float(value)

        if ( self.default == 'Min: ' ):
            if ( self.minObserved > value ):
                self.minObserved = value

                Animation.cancel_all(self)

                anim = Animation(font_size=50, duration=1.)
                anim &= Animation(color=(1, 0, 0, 1))

                anim2 = Animation(font_size=(self.ConfigFontSize))
                anim2 &= Animation(color=(self.ConfigColor))

                anim += anim2
                anim.start(self)

                self.text = self.default + "{0:.2f}".format(value)
        elif ( self.default == 'Max: ' ):
            if ( self.maxObserved < value ):
                Animation.cancel_all(self)
                self.maxObserved = value

                anim = Animation(font_size=50, duration=1.)
                anim &= Animation(color=(1, 0, 0, 1))

                anim2 = Animation(font_size=(self.ConfigFontSize))
                anim2 &= Animation(color=(self.ConfigColor))

                anim += anim2
                anim.start(self)

                self.text = self.default + "{0:.2f}".format(value)
        else:
            self.text = self.default + "{0:.2f}".format(value)


Builder.load_string('''
<NeedleRadial>:
    canvas.before:
        PushMatrix
        Translate:
            xy: (self.x + self.width / 2, self.y + self.height / 2)
        Rotate:
            angle: -self.update
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

    def __init__(self, **kwargs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.id      = "Radial-Needle-" + kwargs.get('PID', 'None')
        self.SetAttrs(**kwargs)
        self.SetStep()
        self.SetOffset()
        self.setData(self.min)
        self.offset = self.offset
        self.setData(self.min)


Builder.load_string('''
<NeedleLinear>:
    canvas:
        # Draw our stencil
        StencilPush
        Rectangle:
            pos: self.x, root.center_y - self.height / 8
            size: self.update, self.height / 2
        StencilUse
        # Now we want to draw our gauge and crop it
        Color:
            rgba: self.r, self.g, self.b, self.a
        Rectangle:
            pos: self.x, root.center_y - self.height / 8
            size: self.update, self.height / 2
            source: self.source
        StencilUnUse

        # Redraw our stencil to remove it
        Rectangle:
            pos: self.x, root.center_y - self.height / 8
            size: self.update, self.height / 2
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

    def __init__(self, **kwargs):
        super(NeedleLinear, self).__init__()
        self.SetAttrs(**kwargs)
        (self.r, self.g, self.b, self.a) = (1, 1, 1, 1)
        self.id = "Linear-Needle-" + kwargs.get('PID', 'None')

    def SetStep(self):
        self.step = self.parent.width / (abs(self.min) + abs(self.max))


Builder.load_string('''
<NeedleEllipse>:
    canvas:
        # Draw our stencil
        StencilPush
        Ellipse:
            size: self.sizex, self.sizey
            pos: self.width / 2 - self.sizex / 2, self.height / 2 - self.sizey / 2
            angle_start: self.angle_start
            angle_end: self.update
        StencilUse

        # Now we want to draw our gauge and crop it
        Ellipse:
            size: self.sizex, self.sizey
            pos: self.width / 2 - self.sizex / 2, self.height / 2 - self.sizey / 2
            source: self.source
            angle_start: self.angle_start
            angle_end: self.update
        StencilUnUse

        # Redraw our stencil to remove it
        Ellipse:
            size: self.sizex, self.sizey
            pos: self.width / 2 - self.sizex / 2, self.height / 2 - self.sizey / 2
            angle_start: self.angle_start
            angle_end: self.update
        StencilPop
''')

class NeedleEllipse(Needle, Widget):
    """
    Create Ellipse widget.
    """
    update       = NumericProperty()
    source       = StringProperty()
    degrees      = NumericProperty()
    angle_start  = NumericProperty()
    sizex        = NumericProperty()
    sizey        = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleEllipse, self).__init__()
        self.SetAttrs(**kwargs)
        self.id = "Ellipse-Needle-" + kwargs.get('PID', 'None')

        self.SetStep()
        self.SetOffset()
        self.offset = self.offset
        self.angle_start = -self.offset
        self.setData(self.min)
        self.setData(50)

    def AttrChange(self):
        self.SetStep()
        self.SetOffset()
