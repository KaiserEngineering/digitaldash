"""
Create DigitalDash.

Main module for creating the DigitalDash!
"""
from DigitalDash.Abstractor import AbstractWidget
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.anchorlayout import AnchorLayout
from etc import Config
from DigitalDash.Dynamic import Dynamic
from DigitalDash.Alert import Alert

from kivy.lang import Builder
Builder.load_string('''
<Background>:
    canvas:
        Rectangle:
            source: app.background
            size: self.size
            pos: self.pos
''')

class Background(AnchorLayout):
    """Uses Kivy language to create background."""

    pass


def setup():
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    callbacks = {}
    ret = []
    containers = []

    view_count = 0
    for view in Config.layouts():
        background = view[0]['background']
        pids       = view[0]['pids']

        # Create our callbacks
        if 'dynamic' in view[1].keys():
            dynamic = view[1]['dynamic']
            dynamic['index'] = view_count
            callbacks.setdefault('dynamic', []).append(makeDynamic(dynamic))

        if 'alerts' in view[1].keys() and len(view[1]['alerts']):
            for alert in view[1]['alerts']:
                alert['index'] = len(callbacks[view_count]) + \
                    1 if view_count in callbacks else 1
                callbacks.setdefault(view_count, []).append(makeAlert(alert))
        else:
            callbacks.setdefault(view_count, [])

        container = BoxLayout(padding=(0, 0, 0, 0))
        ObjectsToUpdate = []
        layout = layouts()

        for widget in view[2]:
            mod = AbstractWidget
            ObjectsToUpdate.append(mod.build(container=container,
                                             args=widget))

        containers.append(container)
        ret.append({'app': layout['bg'], 'background': background, 'alerts': layout['alerts'],
                    'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids})
        view_count += 1

    return (ret, containers, callbacks)


def layouts():
    """
    Create Kivy layouts.

    Defines our Kivy layouts and returns a dict of these layouts. These layouts
    are referenced for adding new widgets to the kivy app.
    """
    bg = Background()
    alerts = BoxLayout()
    args = {
        'bg': bg,
        'alerts': alerts,
    }
    return args


def makeDynamic(args):
    """Create our Dyanamic objects."""
    return Dynamic(args)


def makeAlert(args):
    """Create our Alert object."""
    return Alert(args)
