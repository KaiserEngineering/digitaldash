class PID(object):
    """Class for managing PID information."""
    def __init__(self, **kwargs):
      super(PID, self).__init__()

      self.mode             = kwargs.get( 'mode', 1 )
      self.pid              = 'RPM'
      self.unit             = kwargs.get( 'unit', '' )
      self.units            = kwargs.get( 'units', [] )
      self.baseUnit         = kwargs.get( 'baseUnit', '' )
      self.timestamp        = ''
      self.acquisition_type = ''
      self.devices          = ''
      self.byteCode         = self.generateByteCode()

    def generateByteCode(self):
      pass
