"""Testing basics of DigitalDash."""
import unittest
import main
from etc import config
import os

from lib import digitaldash

import pathlib
working_path = str(pathlib.Path(__file__).parent.parent.absolute())

def test_config_file_from_cli():
    dd = main.GUI()
    dd.working_path = working_path
    dd.new(configFile=working_path+'/etc/configs/single.json')
    assert dd.configFile == working_path+"/etc/configs/single.json", print("Can set config file on DD instantiation")

    (views, containers, callbacks) = digitaldash.setup(dd, config.views(working_path+'/etc/configs/single.json'))
    assert len(views) == 1, print("Only include the enabled views")

    path = working_path+"/etc/configs"

    path = r"%s"%path
    with os.scandir(path) as dirs:
        for entry in dirs:
            json_config = config.views(file=working_path+'/etc/configs/'+entry.name)
            assert config.validateConfig(json_config) == True, print(entry.name+" passes config validation check")
