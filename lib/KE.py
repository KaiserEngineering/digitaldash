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
from etc import Config
from lib.DigitalDash.Dynamic import Dynamic
from lib.DigitalDash.Alert import Alert

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
            callbacks.setdefault('dynamic', []).append(Dynamic(dynamic))
        else:
            callbacks.setdefault('dynamic', [])

        if 'alerts' in view[1].keys() and len(view[1]['alerts']):
            for alert in view[1]['alerts']:
                alert['index'] = len(callbacks[view_count]) + \
                    1 if view_count in callbacks else 1
                callbacks.setdefault(view_count, []).append(Alert(**alert))
        else:
            callbacks.setdefault(view_count, [])

        container = BoxLayout(padding=(30, -70, 30, 0))
        ObjectsToUpdate = []
        layout = layouts()

        for widget in view[2]:
            mod = None

            try:
                mod = globals()[widget['module']]()
            except KeyError:
                mod = AbstractWidget()
            ObjectsToUpdate.append(mod.build(container=container, **widget, pids=pids))

        containers.append(container)
        ret.append({'app': layout['bg'], 'background': background, 'alerts': layout['alerts'],
                    'ObjectsToUpdate': ObjectsToUpdate, 'pids': pids})
        view_count += 1

    from kivy.core.window import Window
    Window.size = (Window.width/2, Window.height/2)

    return (ret, containers, callbacks)


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
