"""Mehtods for getting Config data."""
import json
from kivy.logger import Logger
from kivy.core.window import Window

def layouts(file=None):
    """Get data from JSON."""
    # Allow for a file to be submitted in place of default config, this is useful for tests
    if file == None:
        file = 'etc/Config.json'
    jsonData = {}
    with open(file) as data_file:
        jsonData = json.load(data_file)

        data_file.close()

    Window._rotation = 0

    jsonData = jsonData if validateConfig(jsonData) else json.loads('{"views": [{"alerts": [],"background": "static/imgs/Background/bg.jpg","dynamic": {},"gauges": [{"args": {"MinMax": [0,1],"themeConfig": "Error"},"dataIndex": 0,"module": "Misc","path": "static/imgs/Alerts/"}],"name": "Error","pids": []}]}')

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

def validateConfig(config):
    """Validate config."""

    for view in config['views']:
        if ( not 'name' in view or not view['name'] ):
            Logger.error( "Name required for view" )
            return False
    return True
