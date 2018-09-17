"""
Create DigitalDash.

Main module for creating the DigitalDash!
"""
from DigitalDash.Abstractor import AbstractWidget
from DigitalDash.Widgets import Widgets
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.anchorlayout import AnchorLayout
from etc import Config
from DigitalDash.Dynamic import Dynamic
from DigitalDash.Alert import Alert

class Background(AnchorLayout):
    """Uses Kivy language to create background."""

    pass


def setup():
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    callbacks  = {}
    ret        = []
    containers = []

    view_count = 0
    for view in Config.layouts():
        background = view[0]

        # Create our callbacks
        if 'dynamic' in view[1].keys():
            callbacks[view_count] = callbacks[view_count].append(makeDynamic(view[1]['dynamic'])) if view_count in callbacks else []

            if 'alerts' in view[1].keys():
                for alert in view[1]['alerts']:
                    callbacks[view_count].append(makeAlert(alert)) if view_count in callbacks else []

            bytecode = view[1]['bytecode']

        container = BoxLayout(padding=(0, 0, 0, 0))
        ObjectsToUpdate = []
        layout = layouts()
        WidgetsInstance = Widgets()

        for widget in view[2]:
            mod = AbstractWidget
            ObjectsToUpdate.append(mod.build(container=container,
                                WidgetsInstance=WidgetsInstance,
                                args=widget))

        containers.append(container)
        ret.append({'app': layout['bg'], 'background': background, 'alerts': layout['alerts'], 'ObjectsToUpdate': ObjectsToUpdate, 'WidgetsInstance': WidgetsInstance, 'bytecode': bytecode})
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
