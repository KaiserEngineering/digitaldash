from kivy.uix.widget import Widget
from digitaldash.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from typing import NoReturn

class NeedleEllipse(Needle, Widget):
    """
    Create Ellipse widget.
    """
    update       = NumericProperty()
    source       = StringProperty()
    degrees      = NumericProperty()
    angle_start  = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleEllipse, self).__init__()

        self.set_up(**kwargs)
        self.set_offset()
        self.angle_start = -self.offset
        self.Type = 'Ellipse'
