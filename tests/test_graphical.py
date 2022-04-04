# """Testing basics of DigitalDash."""
# # pylint: skip-file

# import unittest
# from kivy.tests.common import GraphicUnitTest
# import digitaldash.test as KETester
# from digitaldash.needles.needle import Needle
# from digitaldash.massager import smooth
# from static.constants import KE_PID
# from kivy.clock import mainthread

# import pathlib

# from unittest.mock import patch

# from kivy.base import EventLoop
# EventLoop.ensure_window()
# window = EventLoop.window

# working_path = str(pathlib.Path(__file__).parent.parent.absolute())

# t = KETester.Test()


# class Config_TestCase(GraphicUnitTest):
#     @mainthread
#     @patch('digitaldash.digitaldash.windowWidth', return_value=window.width)
#     def test_Single(self):
#         t.new(config="etc/configs/single.json", data=[[50, 100]])
#         t.app.update_values(data={"0x010C": 50})
#         t.app.working_path = working_path

#         for layout in t.app.app.children[0].children:
#             for child in layout.children:
#                 gauge = child.children

#                 for widget in gauge:
#                     if issubclass(Needle, type(widget)):
#                         self.assertEqual(
#                             widget.true_value,
#                             50.0,
#                             "true value for needle is updated correctly",
#                         )
#                         self.assertEqual(
#                             widget.update,
#                             smooth(Old=-60, New=50 * widget.step - widget.offset),
#                             "Calculated update value is set correctly",
#                         )


# class Alerts_TestCase(GraphicUnitTest):
#     @mainthread
#     @patch('digitaldash.digitaldash.windowWidth', return_value=window.width)
#     def test_Single(self):
#         t.new(config="etc/configs/alerts.json", csvFile="tests/data/test.csv")
#         t.app.working_path = working_path

#         for value, text in zip([50, 4001], ["Hello, world", "Alert two"]):
#             t.app.data_source.data = [[value]]
#             t.app.data_source.iteration = 0
#             t.app.loop(1)

#             seen = False
#             for alert in t.app.alerts.children:
#                 self.assertEqual(
#                     alert.text,
#                     text,
#                     "Alert displays correctly for value set to: " + str(value),
#                 )
#                 seen = True
#             self.assertTrue(seen, "Alert did show up")

#             for layout in t.app.app.children[0].children:
#                 for child in layout.children:
#                     gauge = child.children


# if __name__ == "__main__":
#     unittest.main()
