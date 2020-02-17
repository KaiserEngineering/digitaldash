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

t = Test()
class Config_TestCase(GraphicUnitTest):

    def test_Single(self):
        t.Testing( 't/configs/single.json' )
        t.app.update_values([50])

        for layout in t.app.app.children[0].children:
            for child in layout.children:
                gauge = child.children

                for widget in gauge:
                    if ( widget.ObjectType == 'Needle' ):
                        self.assertEqual(widget.true_value, 50.0, "true value for needle is updated correctly")
                        self.assertEqual(widget.update, -59.25, "Calculated update value is set correctly")


if __name__ == '__main__':
    unittest.main()
