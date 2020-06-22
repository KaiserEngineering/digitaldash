"""Testing basics of DigitalDash."""
import unittest
import main
from etc import config
import os

def test_config_file_from_cli():
    dd = main.GUI()
    dd.new(config='etc/configs/single.json')
    assert dd.config == "etc/configs/single.json", print("Can set config file on DD instantiation")

    (views, containers, callbacks) = main.setup(config.views('etc/configs/single.json'))
    assert len(views) == 1, print("Only include the enabled views")

    path = r"etc/configs"
    with os.scandir(path) as dirs:
        for entry in dirs:
            json_config = config.views(file='etc/configs/'+entry.name)
            assert config.validateConfig(json_config) == True, print(entry.name+" passes config validation check")
