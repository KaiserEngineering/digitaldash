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
            Logger.error( "Cannot smooth without a current and new value" )
            return New
        delta = abs(New - Old)
        # increment = Old + 0.75*log(-delta)
        increment = (pow(delta,2) / pow(120, 2)) * 120
        print(increment)

        if ( New - Old  < 0 ):
            return Old - increment
        return Old + increment

        # if delta <= 3:
        #     return Old
        # print("Delta: "+str(delta))
        # print("New: "+str(New))
        # print ("Calculated: "+str(New / ( delta * 0.75 )))
        # return  ( New / ( delta *1.75 ) ) * New
