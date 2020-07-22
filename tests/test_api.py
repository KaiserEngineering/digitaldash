# """Testing basics of DigitalDash."""
from digitaldash.needles.needle import Needle
from digitaldash.needles.radial import NeedleRadial
from digitaldash.needles.linear import NeedleLinear
from digitaldash.needles.ellipse import NeedleEllipse
from digitaldash.ke_lable import KELabel
from digitaldash.alert import Alert
from digitaldash.massager import smooth
from static.constants import KE_PID
import test

import pathlib
working_path = str(pathlib.Path(__file__).parent.parent.absolute())

def test_needle_simple():
    needles = (
        NeedleRadial(
            themeConfig=120, degrees=120, path='/Stock/',
            pids=["0x0C"], pid="0x0C"
        ),
        NeedleEllipse(
            themeConfig=120, degrees=120, path='/Dirt/',
            pids=["0x0C"], pid="0x0C"
        ),
        NeedleLinear(
            themeConfig=120, degrees=120, path='/Linear/',
            pids=["0x0C"], pid="0x0C"
        ),
    )

    for needle in needles:
        offset = float(0) if needle.Type == 'Linear' else float(60)
        value  = float(0) if needle.Type == 'Linear' else float(-60.0)

        assert needle.degrees == float(120), print(needle.Type+" component sets degrees property correctly")
        assert needle.min == float(0), print(needle.Type+" component sets min property correctly")
        assert needle.max == float(8000), print(needle.Type+" component sets max property correctly")
        assert needle.true_value == needle.min, print(needle.Type+" component defaults to minimum value")
        assert needle.offset == offset, print(needle.Type+" component sets correct offset with negative min")
        assert needle.update == value, print(needle.Type+" component sets the correct rotational degrees (not true vlaue)")

        old_value = needle.update

        needle.setData(4000)
        value = float(50) if needle.Type == 'Linear' else float(0)

        assert needle.true_value == float(4000), print( needle.Type+" component defaults to minimum value")
        assert needle.update == smooth(New=value, Old=old_value), print(needle.Type+" component sets the correct rotational value with smoothing (not true value)")


def test_label_simple():
    label = KELabel(
        default        = 'hello, world',
        ConfigColor    = (1, 1, 1 ,1),
        ConfigFontSize = 25,
        data           = 0,
        pid            = "0x0C",
        **KE_PID["0x0C"]
    )
    assert label.text == "hello, world", print("Default text value is set correctly")
    assert label.decimals == str(KE_PID["0x0C"]['decimals']), print("Decimal place set correctly for label")

    label.setData(100)
    assert label.text == "hello, world100", print("Default text value is set correctly form setData method")

    label = KELabel(
        default        = 'Min: ',
        data           = 1,
        pid            = "0x0B"
    )
    label.setData(0)
    assert label.text == "0", print("Default text value is set correctly")
    label.setData(-100)
    assert label.text == "-100", print("Min value sets correctly")

    label.setData(100)
    assert label.text == "-100", print("Min value stays minimum seen")

    label = KELabel(
        default        = 'Max: ',
        data           = 1,
        pid            = "0x0B"
    )
    label.setData(0)
    assert label.text == "0", print("Default text value is set correctly")
    label.setData(100)
    assert label.text == "100", print("Max value sets correctly")

    label.setData(10)
    assert label.text == "100", print("Max value stays max seen")

    # Test PID labels
    label = KELabel(
        default        = '__PID__',
        pid            = "0x0C"
    )
    assert label.text == "RPM", print("Sets PID label correctly")

def test_alert_simple():
    alert = Alert(
        value     = 100,
        op        = '>',
        index     = 0,
        priority  = 0,
        message   = 'Hello, from tests',
        pid       = "0x0B"
    )
    assert alert.check(99) is False, print("Check fails when it should")

    assert alert.check(101) is True, print("Check passes when it should")
    assert alert.text == 'Hello, from tests', print("Do not set alert value")
