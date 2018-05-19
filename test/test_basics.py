"""Testing basics of DigitalDash."""
from scripts import Dynamic
from lib.DigitalDash import Dial
from lib.DigitalDash import Widgets
from lib.DigitalDash import Linear
from lib.DigitalDash import Ellipse
import unittest


class test_scripts(unittest.TestCase):
    """Test scripts basics."""

    def test_dynamic(self):
        """Dynamic tests."""
        args = {
            "index": "0",
            "dataIndex": "0",
            "op": ">",
            "value": "1",
            "priority": "1"
        }

        # Our Dynamic Object with args
        dynamic = Dynamic.Dynamic(args)

        assert dynamic.check(2)
        print('Dynamic successfully checks and returns true: op = >')

        assert dynamic.check(0) is False
        print('Dynamic successfully does not return True: op = >')

        args = {
            "index": "0",
            "dataIndex": "0",
            "op": "<",
            "value": "1",
            "priority": "1"
        }

        # Our Dynamic Object with args
        dynamic = Dynamic.Dynamic(args)

        assert dynamic.check(0)
        print('Dynamic successfully checks and returns true: op = <')

        assert dynamic.check(1) is False
        print('Dynamic successfully does not return True: op = <')


class test_dial(unittest.TestCase):
    """Test basics of Dial widget."""

    def test_gauge(self):
        """Testing basic values of Dial widget."""
        gauge = Dial.Gauge('path/')

        self.assertEquals(gauge.source, 'path/gauge.png')
        print('Successfully set Dial.Gauge image source')

    def test_needle(self):
        """Test needle widget for Dial."""
        args = {'MinMax': [0, 10]}
        themeArgs = {'degrees': 10}

        needle = Dial.Needle('path/', args, themeArgs)
        self.assertEquals(needle.source, 'path/needle.png')
        print('Successfully set Dial.needle image source')

        self.assertEqual(needle.step, 1)
        print('Needle steps set successfully')
        self.assertEqual(needle.degrees, 10)
        print('Needle degrees set correctly')

        needle.setData(100)
        self.assertEqual(needle.angle, -110)
        print('Needle correctly sets angle')
        pass


class test_linear(unittest.TestCase):
    """test Linear widget."""

    def test_attributes(self):
        """Test LinearSlider attributes."""
        args = {'MinMax': [0, 10]}
        themeArgs = {'degrees': 100}
        linear = Linear.LinearSlider('path/', args, themeArgs)

        self.assertEqual(linear.source, 'path/needle.png')
        print('Successfully set Linear slider source')

        self.assertEqual(linear.degrees, 100)
        print('Successfully set Linear slider degrees')

        self.assertEqual(linear.step, 10.0)
        print('Successfully set Linear slider step')

        linear.setData(25)
        self.assertEqual(linear.length, 250.0)
        print('Successfully set length of Linear Slider')


class test_ellipse(unittest.TestCase):
    """test Ellipse widget."""

    def test_attributes(self):
        """Test EllipseSlider attributes."""
        args = {'MinMax': [0, 10]}
        themeArgs = {'degrees': 100, 'angle_start': 0}
        ellipse = Ellipse.EllipseSlider('path/', args, themeArgs)

        self.assertEqual(ellipse.source, 'path/needle.png')
        print('Successfully set Ellipse slider source')

        self.assertEqual(ellipse.degrees, 100)
        print('Successfully set Ellipse slider degrees')

        self.assertEqual(ellipse.step, 10.0)
        print('Successfully set Ellipse slider step')

        ellipse.setData(25)
        self.assertEqual(ellipse.angle_end, 350.0)
        print('Successfully set end angle of Ellipse Slider')


class test_widgets(unittest.TestCase):
    """Unit test for Widgets DB."""

    def test_basics(self):
        """Test basic functionality of Widgets."""
        widgets = Widgets.Widgets()
        testObj = object()

        widgets.Create(testObj, 'test')

        self.assertEqual(widgets.Size(), 1)

        self.assertEqual(type(widgets.Load(ID=0)), type(widgets.Load(name='Test widget')))
        print('Load from ID and Name are equal')

        self.assertEqual(type(widgets.Load(ID=0)['args'][0]), object)
        print('Correct type returned from ID Load')
        self.assertEqual(type(widgets.Load(name='test')['args'][0]), object)
        print('Correct type returned from Name Load')


class test_kelabels(unittest.TestCase):
    """Tests for KELabels."""

    def test_kelabels(self):
        """Test KELabels."""
        args = {}
        label = Dial.KELabel(args)

        self.assertEqual(label.default, '')
        print('Label successfully defaults to empty string')
