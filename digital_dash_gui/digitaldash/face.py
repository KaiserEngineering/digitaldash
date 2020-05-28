from typing import NoReturn, List, TypeVar
from kivy.uix.image import AsyncImage

F = TypeVar('F', bound='Face')
class Face(AsyncImage):
    """
    Create Face widget.

    Face class will return Kivy Image for the face of
    the gauge. Requires one argument of a path to the
    image dir, where **gauge.png** should be stored.

        :param MetaWidget: <DigitalDash.Components.Face>
    """

    def __init__(self, **kwargs):
        """Initite Face Widget."""
        super(Face, self).__init__()
        self.source     = "digital_dash_gui/static/imgs"+kwargs.get('path', '') + 'gauge.png'
        self.size_hint  = (1, 1)
        self.pos        = (0, 0)
        for key in kwargs:
            setattr(self, key, kwargs[key])
