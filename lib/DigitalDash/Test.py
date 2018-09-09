"""Test harness for GUI that runs on file data."""

import csv
import DigitalDash
from numpy import genfromtxt

class Test():
    """Test instance."""

    def __init__(self, args):
        self.iteration = 0
        self.data = self.Load(args['file'])
        self.rows = len(self.data)

    def Load(self, file):
        """Load data from file."""
        return genfromtxt(file, delimiter=',')

    def Start(self):
        """Main start method for test data."""
        data = self.data[self.iteration]
        self.Enumerate()
        return data

    def Enumerate(self):
        """Iterate over test data."""
        self.iteration += 1
        if ( self.iteration >= self.rows ):
            self.iteration = 0
        # Skip headers
        if ( self.iteration == 0 ):
            self.iteration = 1

        return self.iteration