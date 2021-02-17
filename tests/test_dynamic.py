"""Testing basics of DigitalDash."""
import test
from lib.digitaldash import build_from_config
from etc import config
from kivy.uix.anchorlayout import AnchorLayout

import pathlib
working_path = str(pathlib.Path(__file__).parent.parent.absolute())

class Application():
  """Class for replacing 'self' from main.py"""
  def __init__(self):
    pass

def loopy(self):
      pass

def test_pid_byte_code_caching():
    """Ensure our byte code string is always updated on dynamic change"""

    t = test.Test()
    config.setWorkingPath(working_path)

    self              = Application()
    self.WORKING_PATH = working_path
    self.loop         = loopy
    self.configFile   = None
    self.app          = AnchorLayout()
    self.data_source  = t
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

    anchorLayout = build_from_config(self)
    background   = anchorLayout.children[0]

    oldByteCode = self.pid_byte_code
    for dynamic in self.dynamic_callbacks:
      dynamic.change(self)
      break
    assert oldByteCode != self.pid_byte_code
    print(oldByteCode)
    print(self.pid_byte_code)
