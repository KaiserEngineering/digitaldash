"""
Create DigitalDash.

Main module for creating the DigitalDash!
"""
from DigitalDash.Abstractor import AbstractWidget
from DigitalDash.Widgets import Widgets
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.anchorlayout import AnchorLayout
from etc import Config
from scripts.Dynamic import Dynamic
from scripts.Alert import Alert

class Background(AnchorLayout):
    """Uses Kivy language to create background."""

    pass


def setup():
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    callbacks = []
    ret = []
    containers = []

    for view in Config.layouts():
        background = view[0]

        # Create our callbacks
        callbacks.append(makeDynamic(view[1]['dynamic']))
        # for alert in view[1]['alerts']:
        #     callbacks.append(makeAlert(alert))

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
