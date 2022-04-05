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
            workingPath
            + "/themes/"
            + kwargs["themeConfig"]["theme"]
            + "/gauge.png"
        )
        for item in kwargs.items():
            setattr(self, *item)
