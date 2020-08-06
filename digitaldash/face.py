from typing import NoReturn, List, TypeVar
from kivy.uix.image import Image

F = TypeVar('F', bound='Face')
class Face(Image):
    "Wrapper around Kivy.uix.image."

    def __init__(self, **kwargs):
        """
        Args:
          path (str): Path to png image for gauge face
        """
        super(Face, self).__init__()
        working_path = kwargs.get( 'working_path', '' )

        self.source = working_path+"/static/imgs"+kwargs.get('path', '') + 'gauge.png'
        for key in kwargs:
            setattr(self, key, kwargs[key])
