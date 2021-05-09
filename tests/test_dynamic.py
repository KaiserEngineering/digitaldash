"""Testing basics of DigitalDash."""
# pylint: skip-file

import digitaldash.test as KETester
from digitaldash.digitaldash import buildFromConfig
from main import GUI
from etc import config
from kivy.clock import mainthread, Clock
from kivy.config import Config
from kivy.uix.anchorlayout import AnchorLayout
import pathlib
import pytest

Config.set('kivy', 'kivy_clock', 'interrupt')
working_path = str(pathlib.Path(__file__).parent.parent.absolute())
config.setWorkingPath(( working_path ))


@pytest.fixture
def my_application():
    t = KETester.Test()
    config.setWorkingPath(working_path)

    self = GUI()
    self.WORKING_PATH = working_path
    self.configFile = "etc/configs/dynamic.json"
    self.app = AnchorLayout()
    self.data_source = t
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

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
