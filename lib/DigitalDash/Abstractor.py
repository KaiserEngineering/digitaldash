"""Abstract class for updating values."""
from abc import ABC, abstractmethod
from kivy.uix.image import Image
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from abc import ABCMeta
from kivy.uix.relativelayout import RelativeLayout
from etc import Config

class Animator(object):
    """Class for putting data update into widgets."""

    @abstractmethod
    def setData(self, value):
        """
        Abstract setData method most commonly used.
        Override it in Metaclass below if needed differently
        """
        # negative?
        self.update = float(value) * float(self.step) + self.degrees + self.offset


class MetaImage(Image, Animator):
    """Handles meta classes for kivy.uix.image and our Animator classs."""
    pass


class MetaLabel(Label, Animator):
    """Handles meta classes for kivy.uix.label and our Animator classs."""
    def setData(self, value=''):
        """
        Send data to Label widget.

        Check for Min/Max key words to cache values with regex checks.
        """
        if (re.match("(?i)(minimum|min)+", self.default)):
            if (self.min > float(value)):
                self.text = self.default + str(value)
                self.min = float(value)
        elif (re.match("(?i)(maximum|max)+", self.default)):
            if (self.max < float(value)):
                self.text = self.default + str(value)
                self.max = float(value)
        else:
            self.text = self.default + str(value)


class MetaWidget(Widget, Animator):
    """Handles meta classes for kivy.uix.widget and our Animator classs."""
    pass


from DigitalDash.Components import *

class AbstractWidget(object):
    """Generic scaffolding for KE Widgets."""

    @abstractmethod
    def build(**ARGS):
        """Create widgets for Dial."""
        liveWidgets = []
        path = ARGS['args']['path']
        container = ARGS['container']
        WidgetsInstance = ARGS['WidgetsInstance']
        Layout = RelativeLayout()

        # Import theme specifc Config
        themeConfig = Config.getThemeConfig(ARGS['args']['args']['themeConfig'])

        gauge = Gauge(path)
        needleType = ARGS['args']['module']
        needle = globals()['Needle'+ needleType](path, ARGS['args']['args'], themeConfig)

        # Adding widgets that get updated with data
        liveWidgets.append(needle)

        # Add widgets to our floatlayout
        Layout.add_widget(gauge)
        Layout.add_widget(needle)

        labels = []
        # Create our labels
        for labelConfig in themeConfig['labels']:
            # Create Label widget
            label = KELabel(labelConfig)
            labels.append(label)

            # Add to data recieving widgets
            if (labelConfig['data']):
                liveWidgets.append(label)

            Layout.add_widget(label)

        container.add_widget(Layout)

        # Add layouts to 'Database' so they can be loaded
        WidgetsInstance.Create({
            'layout': Layout,
            'gauge': gauge,
            'labels': labels
        })
        return liveWidgets
