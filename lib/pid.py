from static.constants import PID_UNITS
from static.constants import KE_PID

class PID(object):
    """Class for managing PID information."""
    def __init__(self, **kwargs):
      super(PID, self).__init__()

      self.mode             = kwargs.get( 'mode', 1 )
      self.pid              = kwargs.get( 'pid', '' )
      self.unit             = PID_UNITS[kwargs.get( 'unit', '' )]
      self.units            = KE_PID.get(kwargs.get('pid', '')).get('units').get(kwargs['unit'])
      self.baseUnit         = kwargs.get( 'unit', '' )
      self.timestamp        = ''
      self.acquisition_type = ''
      self.devices          = []
      # Generate bytecode from pid
      self.generateByteCode()

    def generateByteCode(self):
      self.byteCode = []
      if len(self.byteCode) == 6:
          self.byteCode = ( int(self.pid, 16) >> 8 ) & 0xFF            # Mode
          self.byteCode.append( 0x00 )                                 # PID byte 0
      else:
          self.byteCode.append( ( int(self.pid, 16) >> 16 ) & 0xFF ) # Mode
          self.byteCode.append( ( int(self.pid, 16) >> 8 ) & 0xFF )  # PID byte 0
      self.byteCode.append( ( int(self.pid, 16) ) & 0xFF )           # PID byte 1
