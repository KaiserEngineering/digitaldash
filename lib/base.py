"""Abstract classes."""
from kivy.properties import NumericProperty
from kivy.logger import Logger
from lib.gauge import Gauge
from lib.needles.ellipse import NeedleEllipse as Ellipse
from lib.needles.radial import NeedleRadial as Radial
from lib.needles.linear import NeedleLinear as Linear
from lib.face import Face
from lib.ke_label import KELabel
from typing import List
from etc import config

class Base():
    """Base class used to provide helper method for creating a gauge."""

    def __init__(self, **kwargs):
        super(Base, self).__init__()
        # Optional values
        self.liveWidgets = []

    def build_component(self, container, **ARGS) -> List:
        """
        Create widgets for Dial.
            :param **ARGS:
        """
        self.container = container
        args = {}
        not_error = ARGS['theme'] != 'Error'

        args['path'] = ARGS['path']

        # Import theme specifc Config
        themeConfig = config.getThemeConfig(ARGS['module'] + '/' + str(ARGS['themeConfig']))
        args['themeConfig'] = {**ARGS, **themeConfig}

        self.needle = None
        if ( not_error ):
            self.needle = globals()[ARGS['module']](**ARGS, **themeConfig)
            (self.needle.sizex, self.needle.sizey) = (512, 512)
            self.needle.pid = ARGS['pid']
            # Adding widgets that get updated with data
            self.liveWidgets.append(self.needle)
        self.face = Face(**args, working_path=ARGS.get('working_path', ''))

        self.gauge = Gauge(Face=self.face, Needle=self.needle)
        self.container.add_widget(self.face)

        # Needle needs to be added after so its on top
        if self.needle:
            self.container.add_widget(self.needle)

        # Create our labels
        for labelConfig in themeConfig['labels']:
            labelConfig['pid'] = ARGS['pid']

            labelConfig = {**ARGS, **labelConfig}

            # Create Label widget
            label = KELabel(**labelConfig, gauge=self.gauge, min=self.needle.min if self.needle else 0)
            self.gauge.labels.append(label)

            # Add to data recieving widgets
            if ('data' in labelConfig):
                self.liveWidgets.append(label)
            self.container.add_widget(label)

        return self.liveWidgets
