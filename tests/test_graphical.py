"""Testing basics of DigitalDash."""
import unittest
from kivy.tests.common import GraphicUnitTest
import test
import main
from digitaldash.needles.needle import Needle
from digitaldash.massager import smooth
from static.constants import KE_PID

import pathlib
working_path = str(pathlib.Path(__file__).parent.parent.absolute())

t = test.Test()
class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.new( Config='etc/configs/single.json', Data=[[50, 100]] )
        t.app.update_values(data={"0x0C": 50})
        t.app.working_path = working_path

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

                for widget in gauge:
                    if ( issubclass(Needle, type(widget)) ):
                        self.assertEqual(widget.true_value, 50.0, "true value for needle is updated correctly")
                        self.assertEqual(widget.update, smooth(Old=-60, New=50 * widget.step - widget.offset), "Calculated update value is set correctly")

class Alerts_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.new( Config='etc/configs/alerts.json', CSV='tests/data/test.csv' )
        t.app.working_path = working_path

        for value, text in zip([50, 4001], ["Hello, world", "Alert two"]):
            t.app.data_source.data = [[value]]
            t.app.data_source.iteration = 0
            t.app.loop(1)

            seen = False
            for alert in t.app.alerts.children:
                self.assertEqual(alert.text, text, "Alert displays correctly for value set to: " + str(value))
                seen = True
            self.assertTrue(seen, "Alert did show up")

            for layout in t.app.app.children[0].children:
                for child in layout.children:
                    gauge = child.children

if __name__ == '__main__':
    unittest.main()
