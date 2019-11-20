"""Abstract class for updating values."""
from abc import ABC, abstractmethod
from abc import ABCMeta
from kivy.uix.relativelayout import RelativeLayout
from etc import Config
from typing import NoReturn, List, TypeVar


class Base(object):
    def __init__(self):
        super(Base, self).__init__()
        # Our required attributes
        self.liveWidgets = []
        self.dataIndex   = -1
        self.Layout      = RelativeLayout()
        self.container   = None

        # Optional values
        self.min         = -9999
        self.max         = 9999

    def AttributeChanged(self):
        for child in self.children:
            self.AttributeChanged(child)

        self.AttrChange()

    def AttrChange(self):
        pass

    def SetStep(self) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, *args) -> NoReturn:
        pass


class Needle(Base):

    def SetOffset(self) -> NoReturn:
        self.offset = self.min

    def SetStep(self) -> NoReturn:
        self.step = self.degrees / (abs(self.min) + abs(self.max))

    def SetAttrs(self, path: str, args, themeArgs) -> NoReturn:
        """Set basic attributes for widget."""
        (self.source, self.degrees, self.min, self.max) = (path + 'needle.png', float(themeArgs.get('degrees', 0)),
                                                           float(args['MinMax'][0]), float(args['MinMax'][1]))

    def setData(self, value='') -> NoReturn:
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
            :param self: Widget Object
            :param value: Update value for gauge needle
        """
        value = float(value)

        if value > self.max:
            value = self.max
        elif value < self.min:
            value = self.min
        self.update = value * self.step - self.step * self.offset


from DigitalDash.Components import *


class AbstractWidget(Base):
    """
    Generic scaffolding for KE Widgets.
        :param object: 
    """

    def build(self, **ARGS):
        """
        Create widgets for Dial.
            :param **ARGS: 
        """
        args             = ARGS['args']
        path             = args['path']
        self.container   = ARGS['container']
        self.Layout      = RelativeLayout()

        args['args']['PID'] = ARGS['pids'][args['dataIndex']]
        self.Layout.id = "Widgets-Layout-" + ARGS['pids'][args['dataIndex']]

        def ChangeAttr(self, _instance):
            for child in self.children:
                child.AttributeChanged()

        # NOTE Can we abstract this more? We have other layouts that may benefit from such a binding
        self.Layout.bind(size=ChangeAttr, pos=ChangeAttr)

        # Import theme specifc Config
        themeConfig = Config.getThemeConfig(args['module'] + '/' + args['args']['themeConfig'])

        gauge = Gauge(path, args)
        if gauge._coreimage:
            self.Layout.add_widget(gauge)

        needleType = args['module']
        needle = globals()['Needle' + needleType](path,
                                                  args['args'], themeConfig)

        needle.dataIndex = args['dataIndex']

        # Adding widgets that get updated with data
        self.liveWidgets.append(needle)

        # Add widgets to our floatlayout
        self.Layout.add_widget(needle)

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
                self.liveWidgets.append(label)

            self.Layout.add_widget(label)

        self.container.add_widget(self.Layout)

        return self.liveWidgets
