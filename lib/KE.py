"""
Create DigitalDash.

Main module for creating the DigitalDash!
"""
from lib.DigitalDash.Base import AbstractWidget
from lib.DigitalDash.Base import Base
from lib.DigitalDash.Components import Clock, Rally
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.anchorlayout import AnchorLayout
from kivy.uix.floatlayout import FloatLayout
from lib.DigitalDash.Dynamic import Dynamic
from lib.DigitalDash.Alert import Alert
from kivy.logger import Logger
from kivy.core.window import Window
from kivy.lang import Builder


Builder.load_string('''
<Background>:
    canvas:
        Rectangle:
            source: app.background_source
            size: self.size
            pos: self.pos
''')

class Background(AnchorLayout):
    """Uses Kivy language to create background."""
    pass


def setup(Layouts):
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    callbacks  = {}
    views      = []
    containers = []

    view_count = 0
    for view in Layouts['views']:
        background = view['background']
        pids       = view['pids']

        # Create our callbacks
        if view['dynamic'].keys():
            dynamic = view['dynamic']
            dynamic['index'] = view_count

            dynamic_obj = Dynamic()
            (ret, msg) = dynamic_obj.new(**dynamic)
            if ( ret ):
              callbacks.setdefault('dynamic', []).append(dynamic_obj)
            else:
                Logger.error( msg )
                callbacks.setdefault('dynamic', [])
        else:
            callbacks.setdefault('dynamic', [])

        if len(view['alerts']):
            for alert in view['alerts']:
                alert['index'] = len(callbacks[view_count]) + \
                    1 if view_count in callbacks else 1
                callbacks.setdefault(view_count, []).append(Alert(**alert))
        else:
            callbacks.setdefault(view_count, [])

        container = BoxLayout(padding=(30, 0, 30, 0))
        ObjectsToUpdate = []
        layout = layouts()

        for widget in view['gauges']:
            mod = None

            try:
                mod = globals()[widget['module']]()
            except KeyError:
                mod = AbstractWidget(gauge_count=len(view['gauges']))
            ObjectsToUpdate.append(mod.build(container=container, **widget, pids=pids))

        containers.append(container)

        views.append({'app': layout['bg'], 'background': background, 'alerts': layout['alerts'],
                    'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids})
        view_count += 1

    return (views, containers, callbacks)


def layouts():
    """
    Create Kivy layouts.

    Defines our Kivy layouts and returns a dict of these layouts. These layouts
    are referenced for adding new widgets to the kivy app.
    """
    bg = Background()
    alerts = FloatLayout()
    args = {
        'bg': bg,
        'alerts': alerts,
    }
    return args
