"""Abstract class for updating values."""
from abc import ABC, abstractmethod
from kivy.uix.image import AsyncImage
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from abc import ABCMeta
from kivy.uix.relativelayout import RelativeLayout
from etc import Config
from DigitalDash.Massager import Massager

from typing import NoReturn, List, TypeVar

ML = TypeVar('ML', bound='MetaLabel')
class MetaLabel(Label):
    """
    Handles meta classes for kivy.uix.label and our Animator object.
        :param Label: Name of label
    """

    def setData(self: ML, value='') -> NoReturn:
        """
        Send data to Label widget.
        Check for Min/Max key words to cache values with regex checks.
            :param self: LabelWidget object
            :param value='': Numeric value for label
        """
        value   = float(value)
        output  = value
        default = ''
        if (self.default == 'Min: '):
            if (self.min > value):
                self.min = value
            value = self.min
        elif (self.default == 'Max: '):
            if (self.max < value):
                self.max = value
            value = self.max
        else:
            default = self.default
        self.text = default + "{0:.2f}".format(value)

    def SizeChange(self):
        pass


MI = TypeVar('MI', bound='MetaImage')
class MetaImage(AsyncImage):
    """
    Handles meta classes for kivy.uix.image and our Animator classs.
        :param Image: Kivy UI image class
    """

    def SetOffset(self: MI) -> NoReturn:
        """Set offset for negative values"""
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0

    def SetStep(self: MI) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self: MI, path: str, args, themeArgs) -> NoReturn:
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs['degrees']),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))

    def SizeChange(self):
        pass

MW = TypeVar('MW', bound='MetaWidget')
class MetaWidget(Widget):
    """
    Handles meta classes for kivy.uix.widget and our Animator classs.
        :param Widget: Widget Obj
    """
    widget = Widget()

    def SetOffset(self: MW) -> NoReturn:
        self.offset = self.min

    def SetStep(self: MW) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self: MW, path: str, args, themeArgs) -> NoReturn:
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs['degrees']),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))

    def setData(self: MW, value='') -> NoReturn:
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """
        value = float(value)
        value = 1000
        if value > self.max:
            value = self.max
        elif value < self.min:
            value = self.min
        self.update = value * self.step - self.step * self.offset

    def SizeChange(self):
        pass

from DigitalDash.Components import *


class AbstractWidget(object):
    """
    Generic scaffolding for KE Widgets.
        :param object: 
    """

    @abstractmethod
    def build(**ARGS):
        """
        Create widgets for Dial.
            :param **ARGS: 
        """
        args = ARGS['args']

        liveWidgets = []
        path        = args['path']
        container   = ARGS['container']
        Layout      = RelativeLayout()

        def SizeChange(self, _instance):
            for child in self.children:
                child.SizeChange()

        # TODO Add a 'PosChange' binding here as well
        # NOTE Can we abstract this more? We have other layouts that may benefit from such a binding
        Layout.bind(size=SizeChange)

        # Import theme specifc Config
        themeConfig = Config.getThemeConfig(args['module'] + '/' + args['args']['themeConfig'])

        gauge = Gauge(path)
        if gauge._coreimage:
            Layout.add_widget(gauge)

        needleType = args['module']
        needle = globals()['Needle' + needleType](path,
                                                  args['args'], themeConfig)

        # This keeps the radial widget from being off the top
        # of the screen.
        needle.center_y = needle.center_y - 10
        gauge.center_y  = gauge.center_y - 10

        needle.dataIndex = args['dataIndex']

        # Adding widgets that get updated with data
        liveWidgets.append(needle)

        # Add widgets to our floatlayout
        Layout.add_widget(needle)

        # Set step after we are added to parent layout
        needle.SetStep()
        needle.SetOffset()

        labels = []
        # Create our labels
        for labelConfig in themeConfig['labels']:
            labelConfig['dataIndex'] = args['dataIndex']
            labelConfig['PID'] = ARGS['pids'][args['dataIndex']]

            # Create Label widget
            label = KELabel(labelConfig)
            labels.append(label)

            # Add to data recieving widgets
            if (labelConfig['data']):
                liveWidgets.append(label)

            Layout.add_widget(label)

        container.add_widget(Layout)

        return liveWidgets
