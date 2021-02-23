from digitaldash.massager import smooth
from typing import NoReturn
from static.constants import KE_PID

class Needle():
    """
    Base class for Needle classes to inherit from.
    """
    def set_up(self, **kwargs):
        self.set_attrs(**kwargs)
        self.set_offset()

        self.update = self.min * self.step - self.offset
        self.true_value = self.min

    def set_offset(self) -> NoReturn:
        if (self.min < 0):
            self.offset = self.degrees / 2 - ( abs(self.min) * self.step )
        else:
            self.offset = self.degrees / 2

    def set_step(self) -> NoReturn:
        """Method for setting the step size for rotation/moving widgets."""
        self.step = self.degrees / (abs(self.min) + abs(self.max))
        if ( self.step == 0 ):
            self.step = 1

    def set_attrs(self, **args) -> NoReturn:
        """Set basic attributes for widget."""
        for key in args:
            setattr(self, key, args[key])

        working_path = args.get( 'working_path', '' )


        pid = args['pid']
        (self.source, self.degrees, self.unit, self.min, self.max) = (
            working_path+"/static/imgs"+args['path'] + 'needle.png',
            float(args.get('degrees', 0)),
            pid.unit,
            pid.range['Min'],
            pid.range['Max'],
        )
        self.set_step()

    def set_data(self, value=0) -> NoReturn:
        """
        Abstract setData method most commonly used.

        Args:
          self (<needle.*>) : One of the needle objects inheriting from digitaldash.needle
          value (float)     : Value to set the needle to
        """
        value = float(value)
        self.true_value = value

        current = self.update

        if value > self.max:
            value = self.max
        elif value < self.min:
            value = self.min
        self.update = smooth( Old=current, New=value * self.step - self.offset )
