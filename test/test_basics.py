"""Testing basics of DigitalDash."""
import unittest

class Basics_TestCase(unittest.TestCase):

    def setUp(self):
        # import class and prepare everything here.
        from lib.DigitalDash import Dynamic
        from lib.DigitalDash import Alert
        from lib.DigitalDash import Components

        args = {
            "path" : "static/imgs/Linear/"
        }

        self.gauge = Components.Gauge(args['path'])

    def test_Radial(self):
        # place your test case here
        self.assertEqual(self.gauge.source, 'static/imgs/Linear/gauge.png')