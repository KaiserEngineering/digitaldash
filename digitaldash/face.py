"""Wrapper around kivy.uix.image for gauge face"""
from kivy.uix.image import Image


class Face(Image):
    "Wrapper around Kivy.uix.image."

    def __init__(self, **kwargs):
        """
        Args:
          path (str): Path to png image for gauge face
        """
        super().__init__()
        workingPath = kwargs.get("workingPath", "")

        self.source = (
            workingPath + "/static/imgs" + kwargs.get("path", "") + "gauge.png"
        )
        for key in kwargs:
            setattr(self, key, kwargs[key])
