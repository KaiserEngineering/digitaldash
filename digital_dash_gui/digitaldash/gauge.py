from typing import NoReturn, List, TypeVar
from kivy.properties import ObjectProperty
from .face import Face
from .needle.needle import Needle

G = TypeVar('G', bound='Gauge')
class Gauge(object):
    """
    Class for coupling Needle and Face instances.
    """

    def __init__(self, Face=False, Needle=False, nocache=True, **kwargs):
        """
        Initite Gauge Widget.
        """
        super(Gauge, self).__init__(**kwargs)
        self.labels = []
        self.face   = ObjectProperty(Face, ObjectType='Face')
        self.needle = ObjectProperty(None, ObjectType='Needle')
        self.buildGauge(Face=Face, Needle=Needle, **kwargs)

    def buildGauge(self, **args):
        self.needle = args.get('Needle', False)
        if ( self.needle ):
            self.needle.setStep()
            self.needle.setData(self.needle.min)
        self.face = args.get('Face', False)

        # This normalizes our canvas needle sizes and label positions
        def _size(instance, size):
            if self.needle: self.needle._size(self)
            self._label_position()
        if ( self.face ): self.face.bind(size=_size)

    def _label_position(self):
        for label in self.labels:
            label.pos = (min(self.face.size) * label.new_pos[0], min(self.face.size) * label.new_pos[1])