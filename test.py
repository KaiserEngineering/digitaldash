"""Test harness for GUI that runs on file data."""
import csv

class Test():
    """Test instance."""

    def __init__(self, **args):
        self.iteration = 0
        self.data      = []

        if ( args.get('file') ):
            self.load_csv(**args)
        self.rows = len(self.data)

        if self.data:
          array = self.data[0]
          self.cols = len(array)

    def set_data(self, data):
      '''Set testing data source.'''
      self.data = data
      if self.data:
          array = self.data[0]
          self.cols = len(array)

    def load_csv(self, file, **args):
        """
        Load data from file.
            :param self: <DigitalDash.Test>Test instance
            :param file: <String>File path
        """
        with open(file, 'r') as csvfile:
            datareader = csv.reader(csvfile, delimiter=',', quotechar='|')
            for row in datareader:
                self.data.append(row)
        if self.data:
          array     = self.data[0]
          self.cols = len(array)

    def start(self, pids=[], **args):
        """
        Main start method for test data.
            :param self: <DigitalDash.Test>Test instance
        """
        data    = self.data[self.iteration]

        key_val = {}
        i       = 0
        for pid in pids:
            if self.cols >= i:
              i = 0
            key_val[pid] = data[i]
            i = i + 1
        self.enumerate()
        return key_val

    def enumerate(self):
        """
        Iterate over test data.
            :param self: <DigitalDash.Test>Test instance
        """
        self.iteration += 1
        if (self.iteration >= self.rows):
            self.iteration = 0
        # Skip headers
        if (self.iteration == 0):
            self.iteration = 1

        return self.iteration

    def update_requirements(self, app, pid_byte_code, pids):
        print("Updating requirements: " + str(pid_byte_code))
        app.pids = pids
        return (1, "PIDs updated")

    def initialize_hardware( self ):
        return ( 1, "Hardware initialized" )

    def reset_hardware( self ):
        return ( 1, "Reset hardware" )

    def power_cycle( self ):
        return ( 1, 'Power cycle' )

    def new( self, Config=None, Data=None, CSV=None ):
        from main import GUI

        if (CSV):
            self.load_csv(CSV)
        elif (Data):
            self.set_data(Data)

        self.app = GUI()
        self.app.new(configFile=Config, data=self)
        self.app.run()
