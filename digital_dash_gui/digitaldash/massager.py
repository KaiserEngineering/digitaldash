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

    if Old is None:
        return New
    if New is None:
        Logger.error( "Cannot set smoothing value without New value" )
        return 0
    delta = abs(New - Old)

    return New - ( delta * 0.75 )
