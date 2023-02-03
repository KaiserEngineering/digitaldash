"""Testing basics of DigitalDash."""
# pylint: skip-file

import main
from etc import config
import os

from digitaldash import digitaldash
from static.constants import get_constants
from themes.loadThemes import getThemes
from main import GUI
from digitaldash.digitaldash import buildFromConfig
from kivy.uix.anchorlayout import AnchorLayout
import pathlib
import pytest
import copy
from unittest.mock import patch

working_path = str(pathlib.Path(__file__).parent.parent.absolute())

from kivy.base import EventLoop

EventLoop.ensure_window()
window = EventLoop.window


@patch("digitaldash.digitaldash.windowWidth", return_value=window.width)
def test_config_file_from_cli(mock_window):
    dd = main.GUI()
    dd.working_path = working_path
    dd.new(configFile=working_path + "/etc/configs/single.json")
    assert dd.configFile == working_path + "/etc/configs/single.json", print(
        "Can set config file on DD instantiation"
    )

    (views, _containers, _callbacks) = (None, None, None)
    ret = digitaldash.setup(
        dd, config.views(working_path + "/etc/configs/single.json")
    )
    if ret:
        (views, _containers, _callbacks) = ret
    assert len(views) == 1, print("Only include the enabled views")

    path = working_path + "/etc/configs"

    path = r"%s" % path
    with os.scandir(path) as dirs:
        for entry in dirs:
            json_config = config.views(
                file=working_path + "/etc/configs/" + entry.name
            )
            (ret, msg) = config.validateConfig(json_config)
            assert ret is True, print(
                entry.name + " passes config validation check"
            )


@patch("digitaldash.digitaldash.windowWidth", return_value=window.width)
def my_gui(newConfig, mock_window):
    config.setWorkingPath(working_path)

    self = GUI()
    self.WORKING_PATH = working_path
    self.jsonData = newConfig
    self.configFile = None
    self.data_source = None
    self.app = AnchorLayout()
    self.working_path = working_path

    buildFromConfig(self)
    return self


@patch("digitaldash.digitaldash.windowWidth", return_value=window.width)
def test_config_programatically(mock_window):
    dd = main.GUI()
    dd.working_path = working_path

    configBase = {
        "views": {
            "0": {
                "name": "base",
                "enabled": True,
                "default": 1,
                "background": "black.png",
                "dynamicMinMax": True,
                "dynamic": {},
                "alerts": [],
                "gauges": [],
            }
        }
    }

    themes = getThemes()
    constants = get_constants()

    for pidTuple in constants["KE_PID"].items():
        (pid, values) = pidTuple
        newConfig = copy.deepcopy(configBase)

        for x in range(0, 3):
            newConfig["views"]["0"]["gauges"].append(
                {
                    "pid": pid,
                }
            )

            for theme in themes:
                newConfig["views"]["0"]["gauges"][x]["theme"] = theme

                for myTuple in constants["KE_PID"][pid]["units"].items():
                    (unit, value) = myTuple
                    newConfig["views"]["0"]["gauges"][x]["unit"] = unit

        newConfigCopy = copy.deepcopy(newConfig)
        my_gui(newConfigCopy)
