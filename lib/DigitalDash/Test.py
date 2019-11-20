"""Test harness for GUI that runs on file data."""

import csv
import lib.DigitalDash
from numpy import genfromtxt

# DO NOT USE Kivy.Logger for this file
class Test():
    """Test instance."""

    def __init__(self, args):
        self.iteration = 0
        self.data = self.Load(args['file'])
        self.rows = len(self.data)

    def Load(self, file):
        """
        Load data from file.
            :param self: <DigitalDash.Test>Test instance
            :param file: <String>File path
        """
        return genfromtxt(file, delimiter=',')

    def Start(self):
        """
        Main start method for test data.
            :param self: <DigitalDash.Test>Test instance
        """
        data = self.data[self.iteration]
        self.Enumerate()
        return data

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
