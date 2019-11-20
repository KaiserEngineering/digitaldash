"""Massages values being passed to gauges to smooth them."""

import lib.DigitalDash


class Massager():
    """
    Main massager class, use to massage values.
    """

    def __init__(self):
        pass

    def Smooth(self, args):
        """
        Smoothing transitions between data points
            :param self: 
            :param args: { 
                'Current': Value,
                 'New' : Value,
            }
        """
        if not args['Current'] and not args['New']:
            return 0

        delta = abs(args['Current'] - args['New'])
        if delta == 0:
            return args['New']
        return args['New'] / (delta / (0.5 * delta))
