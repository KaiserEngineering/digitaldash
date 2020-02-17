"""Testing basics of DigitalDash."""
import unittest

class Alerts_TestCase(unittest.TestCase):

    def setUp(self):
        # import class and prepare everything here.
        from lib.DigitalDash import Alert
        from lib.DigitalDash import Components
        from sbin import run

        args = [
            {"dataIndex": 0, "op": "==", "value": 1, "index": 1, "priority": 1, 
              "message" : "testing"}
        ]

        self.alert = Alert.Alert(args[0])
        self.current = 0
        self.run = run

    def test_alert_basics(self):
        # place your test case here
        self.assertEqual(self.alert.dataIndex, 0)
        self.assertEqual(self.alert.op, '==')
        self.assertEqual(self.alert.value, 1)
        self.assertEqual(self.alert.index, 1)
        self.assertEqual(self.alert.priority, 1)
        self.assertEqual(self.alert.message, 'testing')

        # Check that our eval statement is correct
        check_ret = self.alert.check(1)
        self.assertEqual(check_ret, True)
        check_ret = self.alert.check(0)
        self.assertEqual(check_ret, False)

        # Check our change logic
        self.assertEqual(self.alert.text, '')
        change_ret = self.alert.change(None, None)
        self.assertEqual(self.alert.text, 'testing')
        self.assertEqual(change_ret, False)


    def test_alerts_data(self):
        # Test def check_callbacks
        self.assertIsNot(self.run.DigitalDash.check_callbacks(self, self.alert, 1, [1] ), False)
        self.assertFalse(self.run.DigitalDash.check_callbacks(self, self.alert, 1, [2] ))

        # Test def check_change

