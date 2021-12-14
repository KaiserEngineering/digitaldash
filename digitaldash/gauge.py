"""Class to hold gauges face and needle"""
from kivy.properties import ObjectProperty

# pylint: disable=too-few-public-methods


class Gauge:
    """
    Class for coupling Needle and Face instances.
    """

    def __init__(self, face=False, needle=False, **kwargs):
        """
        Args:
          Face (<digitaldash.face>)             : Gauge face object
          Needle (<digital.dash.needles.needle) : Needle object for gauge
        """
        super().__init__(**kwargs)
        self.labels = []
        self.face = ObjectProperty(face, ObjectType="Face")
        self.needle = ObjectProperty(None, ObjectType="Needle")
        self.buildGauge(Face=face, Needle=needle, **kwargs)

    def buildGauge(self, **args) -> None:
        """Build"""
        self.needle = args.get("Needle", False)
        if self.needle:
            self.needle.setStep()
            self.needle.setData(self.needle.minValue)
        self.face = args.get("Face", False)
