"""Testing basics of DigitalDash."""
# pylint: skip-file

import libdigitaldash
from etc import config
from digitaldash.keLabel import KELabel
from kivy.uix.anchorlayout import AnchorLayout
from digitaldash.digitaldash import buildFromConfig
from main import GUI
from digitaldash.pid import PID

import pytest
import pathlib

working_path = str(pathlib.Path(__file__).parent.parent.absolute())
config.setWorkingPath(( working_path ))

pid = PID(pid="0x010C", unit="PID_UNITS_RPM")

@pytest.fixture
def my_application():
    config.setWorkingPath(working_path)

    self = GUI()
    self.WORKING_PATH = working_path
    self.configFile = "etc/configs/overlapping_pids.json"
    self.data_source = None
    self.app = AnchorLayout()
    self.working_path = str(pathlib.Path(__file__).parent.absolute())

    buildFromConfig(self)
    return self

def test_pid_min_max(my_application):
    """Test min/max feature of PID/keLabel relationship

    Here we want to make sure Min/Max is retained across PIDs in different Views.

    Meaning if I have RPM for two views, the observed Min/Max shouldn't change between
    views.
    """
    def checkForMinMaxLabels(**kwargs):
        for widget in my_application.views['0']['objectsToUpdate'][0]:
            # 0x010C = RPM
            if type(widget) is KELabel and widget.default in ( "Min: ", "Max: " ) and \
              widget.pid.value == '0x010C':
                assert widget.pid.minObserved == kwargs.get('Min', 9999)
                assert widget.pid.maxObserved == kwargs.get('Max', -9999)

        for widget in my_application.views['1']['objectsToUpdate'][0]:
            # 0x010C = RPM
            if type(widget) is KELabel and widget.default in ( "Min: ", "Max: " ) and \
              widget.pid.value == '0x010C':
                assert widget.pid.minObserved == kwargs.get('Min', 9999)
                assert widget.pid.maxObserved == kwargs.get('Max', -9999)

    checkForMinMaxLabels()
    # Update our values with new min/max
    my_application.update_values({ '0x010C':100 })
    my_application.update_values({ '0x010C':10 })
    my_application.update_values({ '0x010C':50 })
    checkForMinMaxLabels(Min=10, Max=100)
