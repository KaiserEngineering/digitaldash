"""Testing basics of DigitalDash."""
# pylint: skip-file

import main
from etc import config
import os

from digitaldash import digitaldash
from static.constants import get_constants
from themes.loadThemes import getThemes
import pathlib

working_path = str(pathlib.Path(__file__).parent.parent.absolute())


def test_config_file_from_cli():
    dd = main.GUI()
    dd.working_path = working_path
    dd.new(configFile=working_path + "/etc/configs/single.json")
    assert dd.configFile == working_path + "/etc/configs/single.json", print(
        "Can set config file on DD instantiation"
    )

    (views, containers, callbacks) = (None, None, None)
    (ret, msg) = digitaldash.setup(
        dd, config.views(working_path + "/etc/configs/single.json")
    )
    if ret:
        (views, containers, callbacks) = ret
    assert len(views) == 1, print("Only include the enabled views")

    path = working_path + "/etc/configs"

    path = r"%s" % path
    with os.scandir(path) as dirs:
        for entry in dirs:
            json_config = config.views(file=working_path + "/etc/configs/" + entry.name)
            (ret, msg) = config.validateConfig(json_config)
            assert  ret == True, print(
                entry.name + " passes config validation check"
            )

def test_config_programatically():
    dd = main.GUI()
    dd.working_path = working_path

    configBase = {
        "views" : {
            "0": {
              "name":"base",
              "enabled" : True,
              "default" : 1,
              "background":"black.png",
              "dynamicMinMax": True,
              "dynamic": {},
              "alerts": [],
              "gauges": []
            }
        }
    }

    themes = getThemes()
    constants = get_constants()

    for pid in constants['KE_PID']:
      newConfig = dict(configBase)
      newConfig['views']['0']['gauges'].append({
        'pid' : constants['KE_PID'][pid]['name'],
      })

      for theme in themes:
        newConfig['views']['0']['gauges'][0]['theme'] = theme

        for myTuple in constants['KE_PID'][pid]['units'].items():
            (unit, value) = (myTuple)
            newConfig['views']['0']['gauges'][0]['unit'] = unit

            (ret, msg) = config.validateConfig(newConfig)
            assert  ret == True, print(
                "Random config passes config validation check"
            )
      # Remove the last gauge we entered
      newConfig['views']['0']['gauges'].pop()
