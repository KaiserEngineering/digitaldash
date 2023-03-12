"""Testing basics of DigitalDash."""
# pylint: skip-file

import digitaldash.test as KETester
from digitaldash.digitaldash import buildFromConfig
from main import GUI
from etc import config
from kivy.clock import mainthread, Clock
from kivy.config import Config
from kivy.uix.label import Label
from kivy.uix.anchorlayout import AnchorLayout
import pathlib
import pytest
from unittest.mock import patch

Config.set("kivy", "kivy_clock", "interrupt")
working_path = str(pathlib.Path(__file__).parent.parent.absolute())
config.setWorkingPath((working_path))

from kivy.base import EventLoop

EventLoop.ensure_window()
window = EventLoop.window


@pytest.fixture
@patch("digitaldash.digitaldash.windowWidth", return_value=window.width)
def my_application(mock_window):
    t = KETester.Test()
    config.setWorkingPath(working_path)

    self = GUI()
    self.WORKING_PATH = working_path
    self.configFile = "etc/configs/dynamic.json"
    self.app = AnchorLayout()
    self.data_source = t
    self.working_path = str(pathlib.Path(__file__).parent.absolute())
    self.version_label = Label(text="Testing")
    self.version_layout = AnchorLayout()

    buildFromConfig(self)
    return self


def test_pid_byte_code_caching(my_application):
    """Ensure our byte code string is always updated on dynamic change"""
    oldByteCode = my_application.pid_byte_code
    for dynamic in my_application.dynamic_callbacks:
        dynamic.change(my_application)
        break
    assert oldByteCode != my_application.pid_byte_code


def test_respect_enable_flag(my_application):
    """Test that we only see our enabled dynamic checks"""
    assert len(my_application.dynamic_callbacks) == 1
