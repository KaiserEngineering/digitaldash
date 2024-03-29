"""PID objects class"""
from typing import Mapping, Union
from static.constants import PID_UNITS
from static.constants import KE_PID

# pylint: disable=too-few-public-methods


class PID:
    """Class for managing PID information."""

    value: str
    unit: str
    range: Mapping[str, str]
    unitLabel: str

    def __init__(self, **kwargs: str):
        super().__init__()

        # Fail if this is wrong?
        self.value = kwargs["pid"]
        self.unit = PID_UNITS[kwargs.get("unit", "")]
        self.unitLabel = kwargs.get("unit", "")
        self.minObserved = 9999
        self.maxObserved = -9999

        self.range = (
            KE_PID.get(self.value).get("units").get(self.unitLabel)
            if self.unit
            else ""
        )
