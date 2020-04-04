"""Massages values being passed to gauges to smooth them."""
from kivy.logger import Logger
from math import *

class Massager():
    """
    Main massager class, use to massage values.
    """

    def __init__(self):
        pass

    def Smooth(self, Old, New, **args):
        """
        Smoothing transitions between data points
            :param self: <DigitalDash.Massage>
            :param 'Old': Value,
            :param 'New' : Value,
        """
        if not Old and not New:
            Logger.error( "Cannot smooth without an old and a new value" )
            return 0
        delta = abs(New - Old)

        return New - ( delta * 0.75 )
