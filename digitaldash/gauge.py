"""Class to hold gauges face and needle"""
from kivy.properties import ObjectProperty

class Gauge():
    """
    Class for coupling Needle and Face instances.
    """

    def __init__(self, Face=False, Needle=False, **kwargs):
        """
        Args:
          Face (<digitaldash.face>)             : Gauge face object
          Needle (<digital.dash.needles.needle) : Needle object for gauge, this can be undefined
        """
        super(Gauge, self).__init__(**kwargs)
        self.labels = []
        self.face = ObjectProperty(Face, ObjectType='Face')
        self.needle = ObjectProperty(None, ObjectType='Needle')
        self.buildGauge(Face=Face, Needle=Needle, **kwargs)

    def buildGauge(self, **args) -> None:
        """Build"""
        self.needle = args.get('Needle', False)
        if self.needle:
            self.needle.setStep()
            self.needle.setData(self.needle.minValue)
        self.face = args.get('Face', False)
