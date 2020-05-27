"""Testing basics of DigitalDash."""
import unittest
from test import Test
from main import GUI, setup
from etc.config import views, validateConfig
import os

class Config_TestCase(unittest.TestCase):
    def test_config_file_from_cli(self):
        dd = GUI()
        dd.new(config='etc/configs/single.json')
        self.assertEqual(dd.config, "etc/configs/single.json", "Can set config file on DD instantiation")

        (self.views, self.containers, self.callbacks) = setup(views('etc/configs/single.json'))
        self.assertEqual(len(self.views), 1, "Only include the enabled views")

        path = r"etc/configs"
        with os.scandir(path) as dirs:
            for entry in dirs:
                json_config = views(file='etc/configs/'+entry.name)
                self.assertTrue(validateConfig(json_config), entry.name+" passes config validation check")

if __name__ == '__main__':
    unittest.main()