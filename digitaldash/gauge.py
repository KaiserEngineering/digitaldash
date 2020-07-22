from typing import NoReturn, List, TypeVar
from kivy.properties import ObjectProperty
from digitaldash.face import Face
from digitaldash.needles.needle import Needle
from typing import NoReturn

G = TypeVar('G', bound='Gauge')
class Gauge(object):
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
        self.face   = ObjectProperty(Face, ObjectType='Face')
        self.needle = ObjectProperty(None, ObjectType='Needle')
        self.buildGauge(Face=Face, Needle=Needle, **kwargs)

    def buildGauge(self, **args) -> NoReturn:
        self.needle = args.get('Needle', False)
        if ( self.needle ):
            self.needle.setStep()
            self.needle.setData(self.needle.min)
        self.face = args.get('Face', False)

        def _size(instance, size) -> NoReturn:
            "This normalizes our canvas needle sizes and label positions"
            if self.needle:
              self.needle._size(self)
            self._label_position()

        if ( self.face ):
          self.face.bind(size=_size)

    def _label_position(self) -> NoReturn:
        "This ensure our labels are correctly positioned"
        for label in self.labels:
            label.pos = (min(self.face.size) * label.new_pos[0], min(self.face.size) * label.new_pos[1])
