"""Test harness for GUI that runs on file data."""
import csv

class Test():
    """Test instance."""

    def __init__(self, **args):
        self.iteration = 0
        self.data = []
        if ( args.get('file') ):
            self.Load(**args)
        self.rows = len(self.data)

    def Load(self, file, **args):
        """
        Load data from file.
            :param self: <DigitalDash.Test>Test instance
            :param file: <String>File path
        """
        with open(file, 'r') as csvfile:
            datareader = csv.reader(csvfile, delimiter=',', quotechar='|')
            for row in datareader:
                self.data.append(row)

    def Start(self, pids=[]):
        """
        Main start method for test data.
            :param self: <DigitalDash.Test>Test instance
        """
        data = self.data[self.iteration]

        key_val = {}
        i = 0
        for pid in pids:
            key_val[pid] = data[i]
            i = i + 1
        self.Enumerate()
        return key_val

    def Enumerate(self):
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

    def UpdateRequirements(self, requirements):
        print("Updating requirements: " + str(requirements))
        return (1, "PIDs updated")

    def InitializeHardware( self ):
        return ( 1, "Hardware initialized" )

    def ResetHardware( self ):
        return ( 1, "Reset hardware" )

    def PowerCycle( self ):
       return ( 1, 'Power cycle' )

    def Testing( self, Config=None, Data=None ):
        from .main import GUI

        if ( Data ):
            self.Load( Data )

        self.app = GUI()
        self.app.new(config=Config, data=self)
        self.app.run()
