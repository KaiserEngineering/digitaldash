"""Testing basics of DigitalDash."""
# pylint: skip-file

import libdigitaldash
from etc import config
from digitaldash.needles.needle import Needle
from digitaldash.needles.radial import NeedleRadial
from digitaldash.needles.linear import NeedleLinear
from digitaldash.needles.ellipse import NeedleEllipse
from digitaldash.keLabel import KELabel
from digitaldash.alert import Alert
from digitaldash.massager import smooth
from static.constants import KE_PID
from kivy.uix.anchorlayout import AnchorLayout
from digitaldash.digitaldash import buildFromConfig
from digitaldash.pid import PID
from main import GUI

import pytest
import pathlib

working_path = str(pathlib.Path(__file__).parent.parent.absolute())
config.setWorkingPath(( working_path ))

pid = PID(pid="0x010C", unit="PID_UNITS_RPM")

def test_needle_simple():
    """Basic needle tests"""
    needles = (
        NeedleRadial(
            theme='Stock ST',
            **config.getThemeConfig( 'Stock ST' ),
            pid=pid,
            working_path=working_path,
        ),
        NeedleEllipse(
            theme='Dirt',
            **config.getThemeConfig( 'Dirt' ),
            pid=pid,
            working_path=working_path,
        ),
        NeedleLinear(
            theme='Bar (Red)',
            **config.getThemeConfig( 'Bar (Red)' ),
            pid=pid,
            working_path=working_path,
        ),
    )

    for needle in needles:
        offset = float(0) if needle.type == "Linear" else float(60)
        value = float(0) if needle.type == "Linear" else float(-60.0)

        assert needle.degrees == float(120), print(
            needle.type + " component sets degrees property correctly"
        )
        assert needle.minValue == float(0), print(
            needle.type + " component sets min property correctly"
        )
        assert needle.maxValue == float(8000), print(
            needle.type + " component sets max property correctly"
        )
        assert needle.trueValue == needle.minValue, print(
            needle.type + " component defaults to minimum value"
        )
        assert needle.offset == offset, print(
            needle.type + " component sets correct offset with negative min"
        )
        assert needle.update == value, print(
            needle.type
            + " component sets the correct rotational degrees (not true vlaue)"
        )

        old_value = needle.update

        needle.setData(4000)

        assert needle.trueValue == float(4000), print(
            needle.type + " component defaults to minimum value"
        )
        assert needle.update == smooth(
            old=old_value, new=4000 * needle.step - needle.offset
        ), print(
            needle.type
            + " component sets the correct rotational value with smoothing (not true value)"
        )

def test_needle_min_max():
    # Test that Min and Max is set correctly based on constants.py
    needle = NeedleRadial(
        theme='Stock ST',
        **config.getThemeConfig( 'Stock ST' ),
        pid=pid,
        working_path=working_path
    )
    assert KE_PID["0x010C"]["units"]["PID_UNITS_RPM"]["Min"] == needle.minValue
    assert KE_PID["0x010C"]["units"]["PID_UNITS_RPM"]["Max"] == needle.maxValue

def test_label_simple():
    """Basic label tests"""
    label = KELabel(
        default="hello, world",
        ConfigColor=(1, 1, 1, 1),
        ConfigFontSize=25,
        data=0,
        pid=pid,
    )
    assert label.text == "hello, world", print("Default text value is set correctly")
    assert label.decimals == "0", print(
        "Default decimal place set correctly for label when no unit provided"
    )

    label = KELabel(
        default="hello, world ",
        ConfigColor=(1, 1, 1, 1),
        ConfigFontSize=25,
        data=0,
        pid=pid,
    )
    assert label.decimals == "0", print(
        "Decimal place set correctly for label when unit is provided"
    )

    label.setData(100)
    assert label.text == "hello, world 100", print(
        "Default text value is set correctly form setData method"
    )

    # Setting decimals to 0
    label = KELabel(
        default="hello, world ",
        ConfigColor=(1, 1, 1, 1),
        ConfigFontSize=25,
        data=0,
        pid=pid,
    )

    label.setData(0)
    assert label.text == "hello, world 0", print("Default text value is set correctly")
    label.setData(-100)
    assert label.text == "hello, world -100", print("Min value sets correctly")

    label.setData(100)
    assert label.text == "hello, world 100", print("Min value stays minimum seen")

    label = KELabel(default="Max: ", data=1, pid=pid)
    label.setData(0)
    assert label.text == "0", print("Default text value is set correctly")
    label.setData(100)
    assert label.text == "100", print("Max value sets correctly")

    label.setData(10)
    assert label.text == "100", print("Max value stays max seen")

    # Test PID labels
    label = KELabel(default="__PID__", pid=pid)
    assert label.text == "RPM", print("Sets PID label correctly")


pid2 = PID(pid="0x010B", unit="PID_UNITS_KPA")


def test_alert_simple():
    """Basic alerts tests"""
    alert = Alert(
        value=100, op=">", viewId=0, priority=0, message="Hello, from tests", pid=pid2
    )
    assert libdigitaldash.check(float(99), alert.value, alert.op) is False, print(
        "Check fails when it should"
    )
    assert libdigitaldash.check(float(101), alert.value, alert.op) is True, print(
        "Check passes when it should"
    )
    assert alert.text == "Hello, from tests", print("Do not set alert value")


@pytest.fixture
def my_application():
    config.setWorkingPath(working_path)

    self = GUI()
    self.WORKING_PATH = working_path
    self.configFile = None
    self.data_source = None
    self.app = AnchorLayout()
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

    buildFromConfig(self)
    return self

def test_build(my_application):
    """Test build process"""
    background = my_application.app.children[0]

    container = background.children[1].children
    assert len(container) == 3

    saw_unitString_label = False
    for widget in container[0].children:
        if type(widget) is KELabel and widget.unitString:
            saw_unitString_label = True
    assert saw_unitString_label == True, print("Set PID unit string")
