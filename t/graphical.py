"""Testing basics of DigitalDash."""
import unittest
from kivy.tests.common import GraphicUnitTest

import sys
import os
import re

path_regex = re.compile('(.+)/t/graphical.py')
path = path_regex.findall(os.path.abspath( __file__ ))[0]

os.chdir(path)
sys.path.append(os.getcwd())
sys.path.append(os.getcwd() + '/lib')
sys.path.append(os.getcwd() + '/etc')

from lib.DigitalDash.Test import Test
from lib.DigitalDash.Massager import Massager

t = Test()
massager = Massager()

class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( 'etc/Configs/single.json' )
        t.app.update_values([50])

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

                for widget in gauge:
                    if ( widget.ObjectType == 'Needle' ):
                        self.assertEqual(widget.true_value, 50.0, "true value for needle is updated correctly")
                        self.assertEqual(widget.update, massager.Smooth(Old=-60, New=50 * widget.step - widget.offset), "Calculated update value is set correctly")

class Alerts_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( 'etc/Configs/alerts.json', 't/configs/test.csv' )
        # Set this value 20 times to appease the buffer
        t.app.update_values([50])
        for _ in range(20):
            t.app.loop(1)

        seen = False
        for alert in t.app.alerts.children:
            self.assertLessEqual(alert.text, "Hello, world", "Alert displays correctly")
            seen = True
        self.assertTrue(seen, "Alert did show up")

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

if __name__ == '__main__':
    unittest.main()
