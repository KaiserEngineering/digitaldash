from static.constants import PID_UNITS
from static.constants import KE_PID

class PID():
    """Class for managing PID information."""
    def __init__(self, **kwargs):
      super(PID, self).__init__()

      self.value      = kwargs.get( 'pid', None )
      self.unit       = PID_UNITS[kwargs.get( 'unit', '' )]
      self.range      = KE_PID.get(kwargs.get('pid', '')).get('units').get(kwargs['unit'])
      self.unitLabel  = kwargs.get( 'unit', '' )

      self.generateByteCode()

    def generateByteCode(self):
      self.byteCode = []
      if len(self.byteCode) == 6:
          self.byteCode = ( int(self.value, 16) >> 8 ) & 0xFF        # Mode
          self.byteCode.append( 0x00 )                               # PID byte 0
      else:
          self.byteCode.append( ( int(self.value, 16) >> 16 ) & 0xFF ) # Mode
          self.byteCode.append( ( int(self.value, 16) >> 8 ) & 0xFF )  # PID byte 0
      self.byteCode.append( ( int(self.value, 16) ) & 0xFF )           # PID byte 1
