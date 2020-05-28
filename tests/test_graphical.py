"""Testing basics of DigitalDash."""
import unittest
from kivy.tests.common import GraphicUnitTest
from digital_dash_gui import test
from digital_dash_gui import main
from digital_dash_gui.digitaldash.needle.needle import Needle
from digital_dash_gui.digitaldash.needle.radial import NeedleRadial
from digital_dash_gui.digitaldash.needle.linear import NeedleLinear
from digital_dash_gui.digitaldash.needle.ellipse import NeedleEllipse
from digital_dash_gui.digitaldash.ke_lable import KELabel
from digital_dash_gui.digitaldash.alert import Alert
from digital_dash_gui.digitaldash.massager import smooth
from digital_dash_gui.static.constants import KE_PID

t = test.Test()
class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( Config='digital_dash_gui/etc/configs/single.json' )
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
        t.Testing( Config='digital_dash_gui/etc/configs/alerts.json', Data='tests/data/test.csv' )
        # Set this value 20 times to appease the buffer
        t.app.update_values({"0x0C": 50})
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
