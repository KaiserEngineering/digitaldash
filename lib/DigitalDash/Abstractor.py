"""Abstract class for updating values."""
from abc import ABC, abstractmethod
from kivy.uix.image import AsyncImage
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from abc import ABCMeta
from kivy.uix.relativelayout import RelativeLayout
from etc import Config
from DigitalDash.Massager import Massager


class Animator(object):
    """
        Class for putting data update into widgets.
            :param object:
    """

    @abstractmethod
    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """

        value = float(value)
        massager = Massager()
        val = 0

        if self.update == self.update:
            val = massager.Smooth({'Current': self.update, 'New': value})
        else:
            val = value

        self.update = val + self.offset
        if value > self.max:
            self.update = self.max + self.offset


class MetaLabel(Label, Animator):
    """
    Handles meta classes for kivy.uix.label and our Animator object.
        :param Label: Name of label
        :param Animator: Animator object that handles data update
    """

    def setData(self, value=''):
        """
        Send data to Label widget.
        Check for Min/Max key words to cache values with regex checks.
            :param self: LabelWidget object
            :param value='': Numeric value for label
        """
        if (self.default == 'Min: '):
            if (self.min > float(value)):
                self.text = str(self.default) + str(value)
                self.min = float(value)
        elif (self.default == 'Max: '):
            if (self.max < float(value)):
                self.text = str(self.default) + str(value)
                self.max = float(value)
        else:
            self.text = str(self.default) + str(value)

    @staticmethod
    def get_x(label, ref_x):
        """ Return the x value of the ref/anchor relative to the canvas """
        return label.center_x - label.texture_size[0] * 0.5 + ref_x

    @staticmethod
    def get_y(label, ref_y):
        """ Return the y value of the ref/anchor relative to the canvas """
        # Note the inversion of direction, as y values start at the top of
        # the texture and increase downwards
        return label.center_y + label.texture_size[1] * 0.5 - ref_y



class MetaImage(AsyncImage, Animator):
    """
    Handles meta classes for kivy.uix.image and our Animator classs.
        :param Image: Kivy UI image class
        :param Animator: Animator class that handles data update
    """

    def SetOffset(self):
        """Set offset for negative values"""
        if (self.min < 0):
            self.offset = self.min
        else:
            self.offset = 0

    def SetStep(self):
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, path, args, themeArgs):
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs['degrees']),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))


class MetaWidget(Widget, Animator):
    """
    Handles meta classes for kivy.uix.widget and our Animator classs.
        :param Widget: Widget Obj
        :param Animator: Animator class that handles data update
    """
    widget = Widget()

    def SetOffset(self):
        self.offset = self.min

    def SetStep(self):
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, path, args, themeArgs):
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs['degrees']),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))


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
        path = args['path']
        container = ARGS['container']
        Layout = RelativeLayout()

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
        gauge.center_y = gauge.center_y - 10

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
            # Create Label widget
            label = KELabel(labelConfig)
            labels.append(label)

            # Add to data recieving widgets
            if (labelConfig['data']):
                liveWidgets.append(label)

            Layout.add_widget(label)

        container.add_widget(Layout)

        return liveWidgets
