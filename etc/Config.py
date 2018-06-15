"""Mehtods for getting Config data."""
import json


def layouts():
    """Get data from JSON."""
    jsonData = {}
    with open('etc/Config.json') as data_file:
        jsonData = json.load(data_file)

    views = jsonData['view']

    return views


def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}
    with open('etc/Themes/' + theme + '.json') as data_file:
        jsonData = json.load(data_file)

    return jsonData

def SetWindow():
    """Run config lines to set-up the kivy window."""
    from kivy.config import Config
    Config.set('graphics', 'position', 'custom')
    Config.set('graphics', 'borderless', 1)
    Config.set('graphics', 'resizable', '0')
    Config.set('graphics', 'top', '16')
    Config.set('graphics', 'left', '150')
    Config.set('graphics', 'fullscreen', '0')
    Config.set('graphics', 'width', '1000')
    Config.set('graphics', 'height', '250')
    Config.write()

    return 1
