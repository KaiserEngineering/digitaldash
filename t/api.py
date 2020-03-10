"""Testing basics of DigitalDash."""
import unittest

import sys
import os
import re

path_regex = re.compile('(.+)/t/api.py')
path = path_regex.findall(os.path.abspath( __file__ ))[0]

os.chdir(path)
sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/lib')
sys.path.append(os.getcwd() + '/etc')
sys.path.append(os.getcwd() + '/static')

from lib.DigitalDash.Base import Needle, NeedleEllipse, NeedleLinear, NeedleRadial
from lib.DigitalDash.Base import KELabel
from lib.DigitalDash.Alert import Alert
from static import Constants

class BasicNeedle_TestCase(unittest.TestCase):

    def test_needle_simple(self):
        needles = (
            NeedleRadial(themeConfig={'degrees': 100, 'MinMax': [-10, 90]}),
            NeedleEllipse(themeConfig={'degrees': 100, 'MinMax': [-10, 90]}),
            NeedleLinear(themeConfig={'degrees': 100, 'MinMax': [-10, 90]}),
        )
        for needle in needles:
            offset = float(-10) if needle.Type == 'Linear' else float(40)
            value  = float(0) if needle.Type == 'Linear' else float(-50)

            self.assertEqual(needle.degrees, float(100), needle.Type+" component sets degrees property correctly")
            self.assertEqual(needle.min, float(-10), needle.Type+" component sets min property correctly")
            self.assertEqual(needle.max, float(90), needle.Type+" component sets max property correctly")
            self.assertEqual(needle.true_value, needle.min, needle.Type+" component defaults to minimum value")
            self.assertEqual(needle.offset, offset, needle.Type+" component sets correct offset with negative min")
            self.assertEqual(needle.update, value, needle.Type+" component sets the correct value (not true vlaue)")

            needle.setData(50)
            value  = float(60) if needle.Type == 'Linear' else float(10)
            self.assertEqual(needle.true_value, float(50), needle.Type+" component defaults to minimum value")
            self.assertEqual(needle.update, value, needle.Type+" component sets the correct value (not true value)")

class BasicLabels_TestCase(unittest.TestCase):

    def test_label_simple(self):
        constants = Constants.GetConstants()

        label = KELabel(
            default        = 'hello, world',
            ConfigColor    = (1, 1, 1 ,1),
            ConfigFontSize = 25,
            data           = 0,
            PID            = 'ENGINE_RPM',
            **constants['ENGINE_RPM']
        )
        self.assertEqual(label.text, "hello, world", "Default text value is set correctly")
        self.assertEqual(label.decimals, str(constants['ENGINE_RPM']['decimals']), "Decimal place set correctly for label")

        label.setData(100)
        self.assertEqual(label.text, "hello, world100", "Default text value is set correctly form setData method")

        label = KELabel(
            default        = 'Min: ',
            data           = 1,
            dataIndex      = 0
        )
        self.assertEqual(label.text, "0.00", "Default text value is set correctly")
        label.setData(-100)
        self.assertEqual(label.text, "-100.00", "Min value sets correctly")

        label.setData(100)
        self.assertEqual(label.text, "-100.00", "Min value stays minimum seen")

        label = KELabel(
            default        = 'Max: ',
            data           = 1,
            dataIndex      = 0
        )
        self.assertEqual(label.text, "0.00", "Default text value is set correctly")
        label.setData(100)
        self.assertEqual(label.text, "100.00", "Max value sets correctly")

        label.setData(10)
        self.assertEqual(label.text, "100.00", "Max value stays max seen")

        # Test PID labels
        label = KELabel(
            default        = '__PID__',
            PID            = 'Some PID'
        )
        self.assertEqual(label.text, "Some PID", "Sets PID label correctly")

class BasicAlerts_TestCase(unittest.TestCase):
    def test_alert_simple(self):
        alert = Alert(
            value     = 100,
            op        = '>',
            index     = 0,
            priority  = 0,
            dataIndex = 0,
            message   = 'Hello, from tests',
        )
        self.assertFalse(alert.check(99), "Check fails when it should")
        self.assertNotEqual(alert.text, 'Hello, from tests', "Do not set alert value")

        self.assertTrue(alert.check(101), "Check passes when it should")
        alert.change('', '')
        self.assertEqual(alert.text, 'Hello, from tests', "Do not set alert value")


if __name__ == '__main__':
    unittest.main()