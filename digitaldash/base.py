"""Abstract classes."""
from kivy.properties import NumericProperty
from kivy.uix.relativelayout import RelativeLayout
from kivy.uix.boxlayout import BoxLayout
from etc.config import getThemeConfig
from kivy.logger import Logger
from digitaldash.gauge import Gauge
from digitaldash.needles.ellipse import NeedleEllipse as Ellipse
from digitaldash.needles.radial import NeedleRadial as Radial
from digitaldash.needles.linear import NeedleLinear as Linear
from digitaldash.face import Face
from digitaldash.ke_lable import KELabel

class GaugeLayout(RelativeLayout):
    gauge_count = NumericProperty(300)

    def __init__(self, gauge_count):
        super(GaugeLayout, self).__init__()

        if ( gauge_count == 1 ):
            self.gauge_count = 0.015
        elif ( gauge_count == 2 ):
            self.gauge_count = 0.030
        else:
            self.gauge_count = 0.1


class Base(object):
    def __init__(self, **kwargs):
        super(Base, self).__init__()
        # Optional values
        self.Layout      = GaugeLayout(kwargs.get('gauge_count', 0))
        self.liveWidgets = []
        self.container   = None


    def buildComponent(self,
                container=BoxLayout(),
                **ARGS
            ):
        """
        Create widgets for Dial.
            :param **ARGS:
        """
        args = {}
        not_error = ARGS['theme'] != 'Error'

        self.container = container

        args['path'] = ARGS['path']

        # Import theme specifc Config
        themeConfig = getThemeConfig(ARGS['module'] + '/' + str(ARGS['themeConfig']))
        args['themeConfig'] = {**ARGS, **themeConfig}

        self.needle = None
        if ( not_error ):
            self.needle = globals()[ARGS['module']](**ARGS, **themeConfig)
            (self.needle.sizex, self.needle.sizey) = (512, 512)
            self.needle.pid = ARGS['pid']
            # Adding widgets that get updated with data
            self.liveWidgets.append(self.needle)
        self.face = Face(**args)

        self.gauge = Gauge(Face=self.face, Needle=self.needle)
        self.Layout.add_widget(self.face)
        # Needle needs to be added after so its on top
        if self.needle: self.Layout.add_widget(self.needle)

        # Create our labels
        for labelConfig in themeConfig['labels']:
            labelConfig['pid'] = ARGS['pids'][ARGS['pids'].index(ARGS['pid'])]

            # Create Label widget
            label = KELabel(**labelConfig, min=self.needle.min if self.needle else 0)
            self.gauge.labels.append(label)

            # Add to data recieving widgets
            if ('data' in labelConfig):
                self.liveWidgets.append(label)
            self.Layout.add_widget(label)

        self.container.add_widget(self.Layout)

        return self.liveWidgets
