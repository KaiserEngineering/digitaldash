"""Class to hold gauges face and needle"""
from typing import NoReturn, TypeVar
from kivy.properties import ObjectProperty

G = TypeVar('G', bound='Gauge')
class Gauge():
    """
    Class for coupling Needle and Face instances.
    """

    def __init__(self, Face=False, Needle=False, nocache=True, **kwargs):
        """
        Args:
          Face (<digitaldash.face>)             : Gauge face object
          Needle (<digital.dash.needles.needle) : Needle object for gauge, this can be undefined
        """
        super(Gauge, self).__init__(**kwargs)
        self.labels = []
        self.face = ObjectProperty(Face, ObjectType='Face')
        self.needle = ObjectProperty(None, ObjectType='Needle')
        self.build_gauge(Face=Face, Needle=Needle, **kwargs)

    def build_gauge(self, **args) -> NoReturn:
        """Build"""
        self.needle = args.get('Needle', False)
        if self.needle:
            self.needle.set_step()
            self.needle.set_data(self.needle.min)
        self.face = args.get('Face', False)
