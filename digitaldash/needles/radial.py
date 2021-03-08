"""Needle code for the radial needles"""
from kivy.properties import NumericProperty
from kivy.uix.image import Image
from digitaldash.needles.needle import Needle


class NeedleRadial(Needle, Image):
    """Wrapper combining digitaldash.needles.needle and kivy.uix.image."""

    update = NumericProperty()

    def __init__(self, **kwargs):
        """Initiate Needle widget."""
        super(NeedleRadial, self).__init__()
        self.setUp(**kwargs)
        self.type = "Radial"
