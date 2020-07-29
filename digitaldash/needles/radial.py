from kivy.uix.widget import Widget
from digitaldash.needles.needle import Needle
from kivy.properties import NumericProperty
from kivy.properties import StringProperty
from kivy.uix.image import Image

class NeedleRadial(Needle, Image):
    """Wrapper combining digitaldash.needles.needle and kivy.uix.image."""

    update = NumericProperty()

    def __init__(self, **kwargs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.setUp(**kwargs)
        self.Type = 'Radial'
