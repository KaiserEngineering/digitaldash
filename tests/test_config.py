"""Testing basics of DigitalDash."""
import unittest
from digital_dash_gui import main
from digital_dash_gui.etc import config
import os

def test_config_file_from_cli():
    dd = main.GUI()
    dd.new(config='digital_dash_gui/etc/configs/single.json')
    assert dd.config == "digital_dash_gui/etc/configs/single.json", print("Can set config file on DD instantiation")

    (views, containers, callbacks) = main.setup(config.views('digital_dash_gui/etc/configs/single.json'))
    assert len(views) == 1, print("Only include the enabled views")

    path = r"digital_dash_gui/etc/configs"
    with os.scandir(path) as dirs:
        for entry in dirs:
            json_config = config.views(file='digital_dash_gui/etc/configs/'+entry.name)
            assert config.validateConfig(json_config) == True, print(entry.name+" passes config validation check")
