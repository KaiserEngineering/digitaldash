"""Test harness for GUI that runs on file data."""
import csv
from numpy import genfromtxt

import os, sys, re
path_regex = re.compile('(.+)../')
path = path_regex.findall(os.path.abspath( __file__ ))[0]
os.chdir(path)
sys.path.append(os.getcwd())

# DO NOT USE Kivy.Logger for this file
class Test():
    """Test instance."""

    def __init__(self, **args):
        self.iteration = 0
        if ( args.get('file') ):
            self.Load(args.get('file', ''))
        else:
            self.data = []
        self.rows = len(self.data)

    def Load(self, file):
        """
        Load data from file.
            :param self: <DigitalDash.Test>Test instance
            :param file: <String>File path
        """
        self.data = genfromtxt(file, delimiter=',')

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

    def Testing( self, Config=None, Data=None ):
        from main import GUI

        if ( Data ):
            self.Load( Data )

        self.app = GUI()
        self.app.new(config=Config, data=self)
        self.app.run()
