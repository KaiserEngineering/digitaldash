"""Mehtods for getting Config data."""
import json
from kivy.logger import Logger
from kivy.core.window import Window

working_path = ''

def setWorkingPath(path):
  global working_path
  working_path = path

def views(file=None):
    """Get data from JSON."""
    # Allow for a file to be submitted in place of default config, this is useful for tests
    if file == None or file == '':
        file = working_path+'/etc/config.json'
    jsonData = {}

    with open(file) as data_file:
        jsonData = json.load(data_file)

        data_file.close()

    jsonData = jsonData if validateConfig(jsonData) else json.loads('''
        {"views": { "0": {
            "alerts": [], "default": 1, "theme": "Error", "background": "bg.jpg",
            "dynamic": {},"gauges": [{"themeConfig": "Error","pid": "","module": "Misc",
            "path": "Alerts/"}], "name": "Error", "enabled": 1}}}
        ''')

    return jsonData

def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}

    try:
        with open(working_path+'/etc/themes/' + theme + '.json') as data_file:
            jsonData = json.load(data_file)

            data_file.close()
    except FileNotFoundError:
        Logger.info( "Config: Could not find config file: " + '/etc/themes/' + theme + '.json' )

    return jsonData

def validateConfig(config):
    """Validate config."""

    required_values = {
        "top" : {
            "name"      : str,
            "enabled"   : bool,
            "theme"     : str,
            "background": str,
            "dynamic"   : dict,
            "alerts"    : list,
            "gauges"    : list
        },
        "alerts" : {
            "pid"      : str,
            "op"       : str,
            "value"    : str,
            "unit"     : str,
            "priority" : int,
            "message"  : str
        },
        "gauges"          : {
            "themeConfig" : str,
            "pid"         : str,
            "unit"        : str,
            "module"      : str,
            "path"        : str
        },
        "dynamic" : {
            "enabled"  : bool,
            "pid"      : str,
            "op"       : str,
            "priority" : int,
            "value"    : str,
            "unit"     : str
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
                    if ( not type( view[key] ) == required_values['top'][key] and type( view[key] ) != 'n/a' ):
                        Logger.error( key + " must be of type " + str(required_values['top'][key]) )
                        return False
                    continue
            else:
                for item in required_values[key].keys():
                    if ( len(view[key]) ):

                        if ( type( view[key] ) == dict ):
                            if ( not type( view[key][item] ) == required_values[key][item] and type( view[key][item] ) != 'n/a' ):
                                Logger.error( item + " for " + str(view[key][item]) + " must be of type " + str(required_values[key][item]) )
                                return False
                            continue
                        else:
                            for hash in view[key]:
                                if ( not type( hash.get(item) ) == required_values[key][item] and type( hash.get(item) ) != 'n/a' ):
                                    Logger.error( item + " for " + str(hash[item]) + " must be of type " + str(required_values[key][item]) )
                                    return False
                                continue
    if ( not saw_default ):
        Logger.error( "Default view required" )
        return False
    return True
