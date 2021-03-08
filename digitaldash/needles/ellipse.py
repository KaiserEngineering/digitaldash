from kivy.uix.widget import Widget
from digitaldash.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty


class NeedleEllipse(Needle, Widget):
    """
    Create Ellipse widget.
    """

    update = NumericProperty()
    source = StringProperty()
    degrees = NumericProperty()
    angleStart = NumericProperty()

    def __init__(self, **kwargs):
        super(NeedleEllipse, self).__init__()

        self.setUp(**kwargs)
        self.setOffset()
        self.angleStart = -self.offset
        self.type = "Ellipse"
