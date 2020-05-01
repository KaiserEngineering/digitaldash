"""Mehtods for getting Config data."""
import json
from kivy.logger import Logger

def layouts(file=None):
    """Get data from JSON."""
    # Allow for a file to be submitted in place of default config, this is useful for tests
    if file == None:
        file = 'etc/Config.json'
    jsonData = {}
    with open(file) as data_file:
        jsonData = json.load(data_file)

        data_file.close()

    return jsonData


def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}
    try:
        with open('etc/Themes/' + theme + '.json') as data_file:
            jsonData = json.load(data_file)

            data_file.close()
    except FileNotFoundError:
        Logger.error( "Config: Could not find config file: " + 'etc/Themes/' + theme + '.json' )

    return jsonData
