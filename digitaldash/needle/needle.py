from digitaldash.massager import smooth
from typing import NoReturn, List, TypeVar
from static.constants import KE_PID

class Needle():
    """
    Base class for Needle classes to inherit from.
    """
    def SetUp(self, **kwargs):
        self.SetAttrs(**kwargs)
        self.SetOffset()

        self.update = self.min * self.step - self.offset
        self.true_value = self.min

    def _size(self, gauge):
        '''Helper method that runs when gauge face changes size.'''
        (self.sizex, self.sizey) = gauge.face.norm_image_size

    def SetOffset(self) -> NoReturn:
        if (self.min < 0):
            self.offset = self.degrees / 2 - ( abs(self.min) * self.step )
        else:
            self.offset = self.degrees / 2

    def setStep(self) -> NoReturn:
        """Method for setting the step size for rotation/moving widgets."""
        self.step = self.degrees / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1

    def SetAttrs(self, **args) -> NoReturn:
        """Set basic attributes for widget."""
        for key in args:
            setattr(self, key, args[key])

        (self.source, self.degrees, self.min, self.max) = (
            args['path'] + 'needle.png',
            float(args.get('degrees', 0)),
            KE_PID[args['pids'][args['view_id']]]['Min'],
            KE_PID[args['pids'][args['view_id']]]['Max']
        )
        self.setStep()

    def setData(self, value=0) -> NoReturn:
        """
        Abstract setData method most commonly used.
            :param self: Widget Object
            :param value: Update value for gauge needle
        """
        value = float(value)
        self.true_value = value

        current = self.update

        if value > self.max:
            value = self.max
        elif value < self.min:
            value = self.min
        self.update = smooth( Old=current, New=value * self.step - self.offset )
