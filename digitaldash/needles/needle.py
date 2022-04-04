"""Main needle base class"""
from digitaldash.massager import smooth
from kivy.logger import Logger
from kivy.graphics import Color


class Needle:
    """
    Base class for Needle classes to inherit from.
    """

    degrees: float
    source: str
    trueValue: float
    offset: float
    step: float
    unit: int
    minValue: float
    maxValue: float
    valueRange: float

    def setUp(self, **kwargs):
        """Call all our methods"""
        self.setAttrs(**kwargs)
        self.setOffset()

        self.update = self.minValue * self.step - self.offset
        self.trueValue = self.minValue

    def setOffset(self) -> None:
        """Figure offset"""
        if self.minValue < 0:
            self.offset = self.degrees / 2 - (abs(self.minValue) * self.step)
        else:
            self.offset = self.degrees / 2

    def setStep(self) -> None:
        """Method for setting the step size for rotation/moving widgets."""
        self.step = self.degrees / (abs(self.minValue) + abs(self.maxValue))
        if self.step == 0:
            self.step = 1

    def setAttrs(self, **args) -> None:
        """Set basic attributes for widget."""
        for key in args:
            setattr(self, key, args[key])

        workingPath = args.get("workingPath", "")

        pid = args["pid"]
        (
            self.source,
            self.degrees,
            self.unit,
            self.minValue,
            self.maxValue,
        ) = (
            workingPath + "/themes/" + args["theme"] + "/needle.png",
            float(args.get("degrees", 0)),
            pid.unit,
            pid.range["Min"],
            pid.range["Max"],
        )
        self.colorChanging = args.get("colorChanging", False)
        self.valueRange = self.maxValue - self.minValue
        self.setStep()

    def setColor(self):
        color = 0.7 - (
            (self.trueValue - self.minValue) * (0.7) / (self.valueRange)
        )
        self.color = tuple(Color(color, 1, 1, mode="hsv").rgba)

    def setData(self, value=0) -> None:
        """
        Abstract setData method most commonly used.

        Args:
          self (<needle.*>) : One of the needle objects inheriting from digitaldash.needle
          value (float)     : Value to set the needle to
        """
        try:
            value = float(value)
            self.trueValue = value

            current = self.update

            if value > self.maxValue:
                value = self.maxValue
            elif value < self.minValue:
                value = self.minValue
            self.update = smooth(
                old=current, new=value * self.step - self.offset
            )
        except Exception:
            Logger.error("GUI: needle.py is not numeric")

        if self.colorChanging:
            self.setColor()
