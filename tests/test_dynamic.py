"""Testing basics of DigitalDash."""
# pylint: skip-file

from kivy.uix.anchorlayout import AnchorLayout
import digitaldash.test as KETester
from digitaldash.digitaldash import buildFromConfig
from etc import config
from kivy.clock import mainthread

import pathlib

working_path = str(pathlib.Path(__file__).parent.parent.absolute())
config.setWorkingPath(( working_path ))

class Application:
    """Class for replacing 'self' from main.py"""

    def __init__(self):
        pass


def loopy(self):
    pass


@mainthread
def test_pid_byte_code_caching():
    """Ensure our byte code string is always updated on dynamic change"""

    t = KETester.Test()
    config.setWorkingPath(working_path)

    self = Application()
    self.WORKING_PATH = working_path
    self.loop = loopy
    self.configFile = "etc/configs/dynamic.json"
    self.app = AnchorLayout()
    self.data_source = t
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

    buildFromConfig(self)
    background = self.app.children[0]

    oldByteCode = self.pid_byte_code
    for dynamic in self.dynamic_callbacks:
        if dynamic.viewId == self.current:
            continue
        else:
            dynamic.change(self)
            break
    assert oldByteCode != self.pid_byte_code
