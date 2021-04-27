"""Massages values being passed to gauges to smooth them."""
from kivy.logger import Logger


def smooth(old, new) -> float:
    """
    Smoothing transitions between data points
        :param self: <DigitalDash.Massage>
        :param 'Old': Value,
        :param 'New' : Value,
    """

    if old is None:
        return new
    if new is None:
        Logger.error("Cannot set smoothing value without New value")
        return 0
    delta = abs(new - old)

    return new - (delta * 0.1)
