"""Testing basics of DigitalDash."""
import test
from etc import config
from lib.needles.needle import Needle
from lib.needles.radial import NeedleRadial
from lib.needles.linear import NeedleLinear
from lib.needles.ellipse import NeedleEllipse
from lib.ke_label import KELabel
from lib.alert import Alert
from lib.massager import smooth
from static.constants import KE_PID
import libdigitaldash
from kivy.uix.anchorlayout import AnchorLayout
from lib.digitaldash import build_from_config

import pathlib
working_path = str(pathlib.Path(__file__).parent.parent.absolute())

def test_needle_simple():
    """Basic needle tests"""

    assert 1 == 1
    needles = (
        NeedleRadial(
            themeConfig=120, degrees=120, path='/Stock/',
            pids=["0x010C"], pid="0x010C"
        ),
        NeedleEllipse(
            themeConfig=120, degrees=120, path='/Dirt/',
            pids=["0x010C"], pid="0x010C"
        ),
        NeedleLinear(
            themeConfig=120, degrees=120, path='/Linear/',
            pids=["0x010C"], pid="0x010C"
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

        needle.set_data(4000)

        assert needle.true_value == float(4000), print( needle.Type+" component defaults to minimum value")
        assert needle.update == smooth( Old=old_value, New=4000 * needle.step - needle.offset ), print(needle.Type+" component sets the correct rotational value with smoothing (not true value)")

def test_label_simple():
    """Basic label tests"""
    label = KELabel(
        default        = 'hello, world',
        ConfigColor    = (1, 1, 1 ,1),
        ConfigFontSize = 25,
        data           = 0,
        pid            = "0x010C",
        **KE_PID["0x010C"]
    )
    assert label.text == "hello, world", print("Default text value is set correctly")
    assert label.decimals == str(KE_PID["0x010C"]['decimals']), print("Decimal place set correctly for label")

    label.set_data(100)
    assert label.text == "hello, world100", print("Default text value is set correctly form set_data method")

    label = KELabel(
        default        = 'Min: ',
        data           = 1,
        pid            = "0x010B"
    )
    label.set_data(0)
    assert label.text == "0", print("Default text value is set correctly")
    label.set_data(-100)
    assert label.text == "-100", print("Min value sets correctly")

    label.set_data(100)
    assert label.text == "-100", print("Min value stays minimum seen")

    label = KELabel(
        default        = 'Max: ',
        data           = 1,
        pid            = "0x010B"
    )
    label.set_data(0)
    assert label.text == "0", print("Default text value is set correctly")
    label.set_data(100)
    assert label.text == "100", print("Max value sets correctly")

    label.set_data(10)
    assert label.text == "100", print("Max value stays max seen")

    # Test PID labels
    label = KELabel(
        default        = '__PID__',
        pid            = "0x010C"
    )
    assert label.text == "RPM", print("Sets PID label correctly")

def test_alert_simple():
    """Basic alerts tests"""
    alert = Alert(
        value     = 100,
        op        = '>',
        index     = 0,
        priority  = 0,
        message   = 'Hello, from tests',
        pid       = "0x010B"
    )
    assert libdigitaldash.check(float(99), alert.value, alert.op) is False, print("Check fails when it should")
    assert libdigitaldash.check(float(101), alert.value, alert.op) is True, print("Check passes when it should")
    assert alert.text == 'Hello, from tests', print("Do not set alert value")

class Application():
  """Class for replacing 'self' from main.py"""
  def __init__(self):
    self.background_source = 'woof'

def test_build():
    """Test build process"""
    config.setWorkingPath(working_path)

    def loop():
      pass

    self              = Application()
    self.WORKING_PATH = working_path
    self.loop         = loop
    self.configFile   = None
    self.app          = AnchorLayout()
    self.data_source  = None
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

    appObj     = build_from_config(self)
    background = appObj.children[0]

    container = background.children[1].children
    assert len(container) == 3

    saw_unit_string_label = False
    for widget in container[0].children:
      if type(widget) is KELabel and widget.unit_string:
        saw_unit_string_label = True
    assert saw_unit_string_label == True, print( "Set PID unit string" )
