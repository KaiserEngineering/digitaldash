"""Mehtods for getting Config data."""
import json
from kivy.logger import Logger
from kivy.core.window import Window

def views(file=None):
    """Get data from JSON."""
    # Allow for a file to be submitted in place of default config, this is useful for tests
    if file == None or file == '':
        file = 'etc/config.json'
    jsonData = {}
    with open(file) as data_file:
        jsonData = json.load(data_file)

        data_file.close()

    Window._rotation = 0

    jsonData = jsonData if validateConfig(jsonData) else json.loads('''
        {"views": { "0": {
            "alerts": [], "default": 1, "theme": "Error", "background": "bg.jpg",
            "dynamic": {},"gauges": [{"themeConfig": "Error","pid": "","module": "Misc",
            "path": "Alerts/"}], "name": "Error", "enabled": 1, "pids": [""]}}}
        ''')

    return jsonData

def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}

    try:
        with open('etc/themes/' + theme + '.json') as data_file:
            jsonData = json.load(data_file)

            data_file.close()
    except FileNotFoundError:
        Logger.info( "Config: Could not find config file: " + 'etc/themes/' + theme + '.json' )

    return jsonData

def validateConfig(config):
    """Validate config."""

    required_values = {
        "top" : {
                "name": str,
                "enabled" : int,
                "theme" : str,
                "background": str,
                "pids": list,
                "dynamic": dict,
                "alerts": list,
                "gauges": list
        },
        "alerts" : {
            "pid": str,
            "op": str,
            "value": int,
            "priority": int,
            "message" : str
        },
        "gauges" : {
            "themeConfig" : str,
            "pid" : str,
            "module" : str,
            "path" : str
        },
        "dynamic" : {
            "pid" : str,
            "op" : str,
            "priority" : int,
            "value" : int
        },
    }

    saw_default = False
    for id in config['views']:
        view = config['views'][id]

        if ( 'default' in view and view['default']):
            saw_default = True

        # Top level keys
        for key in required_values.keys():
            if ( not key in view and not key == 'top' ):
                Logger.error( key + " required for view" )
                return False
            if ( key == 'top' ):
                for key in required_values['top'].keys():
                    if ( not type( view[key] ) == required_values['top'][key] ):
                        Logger.error( key + " must be of type " + str(required_values['top'][key]) )
                        return False
                    continue
            else:
                for item in required_values[key].keys():
                    if ( len(view[key]) ):

                        if ( type( view[key] ) == dict ):
                            if ( not type( view[key][item] ) == required_values[key][item] ):
                                Logger.error( item + " for " + key + " must be of type " + str(required_values[key][item]) )
                                return False
                            continue
                        else:
                            for hash in view[key]:
                                if ( not type( hash[item] ) == required_values[key][item] ):
                                    Logger.error( item + " for " + key + " must be of type " + str(required_values[key][item]) )
                                    return False
                                continue
    if ( not saw_default ):
        Logger.error( "Default view required" )
        return False
    return True
