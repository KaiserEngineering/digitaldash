"""Testing basics of DigitalDash."""
import unittest
from kivy.tests.common import GraphicUnitTest
from test import Test
from main import GUI
from digitaldash.needle.needle import Needle
from digitaldash.needle.radial import NeedleRadial
from digitaldash.needle.linear import NeedleLinear
from digitaldash.needle.ellipse import NeedleEllipse
from digitaldash.ke_lable import KELabel
from digitaldash.alert import Alert
from digitaldash.massager import smooth
from static.constants import KE_PID

t = Test()
class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( Config='etc/configs/single.json' )
        t.app.update_values([50])

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

                for widget in gauge:
                    if ( issubclass(Needle, type(widget)) ):
                        self.assertEqual(widget.true_value, 50.0, "true value for needle is updated correctly")
                        self.assertEqual(widget.update, smooth(Old=-60, New=50 * widget.step - widget.offset), "Calculated update value is set correctly")

class Alerts_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( Config='etc/configs/alerts.json', Data='t/data/test.csv' )
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
