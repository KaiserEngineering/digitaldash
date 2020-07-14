"""Testing basics of DigitalDash."""
import unittest
from kivy.tests.common import GraphicUnitTest
import test
import main
from digitaldash.needles.needle import Needle
from digitaldash.needles.radial import NeedleRadial
from digitaldash.needles.linear import NeedleLinear
from digitaldash.needles.ellipse import NeedleEllipse
from digitaldash.ke_lable import KELabel
from digitaldash.alert import Alert
from digitaldash.massager import smooth
from static.constants import KE_PID

t = test.Test()
class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( Config='etc/configs/single.json' )
        t.app.update_values({"0x0C": 50})

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

                for widget in gauge:
                    if ( issubclass(Needle, type(widget)) ):
                        self.assertEqual(widget.true_value, 50.0, "true value for needle is updated correctly")
                        self.assertEqual(widget.update, smooth(Old=-60, New=50 * widget.step - widget.offset), "Calculated update value is set correctly")

class Alerts_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( Config='etc/configs/alerts.json', Data='tests/data/test.csv' )
        # Set this value 20 times to appease the buffer
        t.app.update_values({"0x0C": 50})

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
