"""Massages values being passed to gauges to smooth them."""
from kivy.logger import Logger
from math import *

def smooth(Old, New, **args):
    """
    Smoothing transitions between data points
        :param self: <DigitalDash.Massage>
        :param 'Old': Value,
        :param 'New' : Value,
    """

    if not Old:
        return New
    if not New:
        Logger.error( "Cannot set smoothing value without New value" )
        return 0
    delta = abs(New - Old)

    return New - ( delta * 0.75 )