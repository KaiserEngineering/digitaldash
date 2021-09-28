"""Needle code for the static needles"""
from kivy.properties import NumericProperty
from kivy.uix.image import Image
from digitaldash.needles.needle import Needle


class NeedleStatic(Needle, Image):
    """Wrapper combining digitaldash.needles.needle and kivy.uix.image."""

    update = NumericProperty()

    def __init__(self, **kwargs):
        """Initiate Needle widget."""
        super(NeedleStatic, self).__init__()
        self.setUp(**kwargs)
        self.type = "Static"
