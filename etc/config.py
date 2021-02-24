"""Mehtods for getting Config data."""
import json
from kivy.logger import Logger

WORKINGPATH = ''


def setWORKINGPATH(path):
    """Simple setter"""
    global WORKINGPATH
    WORKINGPATH = path


def views(file=None):
    """Get data from JSON."""
    # Allow for a file to be submitted in place of default config, this is
    # useful for tests
    if file is None or file == '':
        file = WORKINGPATH + '/etc/config.json'
    jsonData = {}
    errorConfig = ('''
    {"views": { "0": {
              "alerts": [{
          "pid": "n/a",
          "op": ">",
          "value": "-9999",
          "unit": "n/a",
          "priority": 1,
          "message": "Config file isn't valid!"
        }], "default": 1, "theme": "Error", "background": "bg.jpg",
              "dynamic": {},"gauges": [], "name": "Error", "enabled": 1}}}
          ''')
    try:
        with open(file) as dataFile:
            jsonData = json.load(dataFile)

            dataFile.close()

        jsonData = jsonData if validateConfig(
            jsonData) else json.loads(errorConfig)
    except Exception as e:
        # We can shorten the error message by removing the trace/line the
        # error happened on.
        errorString = (str(e).split(':'))[0]
        errorConfig = errorConfig.replace(
            "Config file isn't valid!", errorString)
        Logger.error("GUI: Invalid config provided, falling back to default")
        jsonData = json.loads(errorConfig)
    return jsonData


def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}

    try:
        with open(WORKINGPATH + '/etc/themes/' + theme + '.json') as dataFile:
            jsonData = json.load(dataFile)

            dataFile.close()
    except FileNotFoundError:
        Logger.info(
            "Config: Could not find config file: /etc/themes/%s.json", theme)

    return jsonData


def validateConfig(config):
    """Validate config."""

    requiredValues = {
        "top": {
            "name": str,
            "enabled": bool,
            "theme": str,
            "background": str,
            "dynamic": dict,
            "alerts": list,
            "gauges": list
        },
        "alerts": {
            "pid": str,
            "op": str,
            "value": str,
            "unit": str,
            "priority": int,
            "message": str
        },
        "gauges": {
            "themeConfig": str,
            "pid": str,
            "unit": str,
            "module": str,
            "path": str
        },
        "dynamic": {
            "enabled": bool,
            "pid": str,
            "op": str,
            "priority": int,
            "value": str,
            "unit": str
        },
    }

    sawDefault = False
    for Id in config['views']:
        view = config['views'][Id]

        if ('default' in view and view['default']):
            sawDefault = True

        # Top level keys
        for key in requiredValues:
            if key not in view and not key == 'top':
                Logger.error("%s required for view", key)
                return False
            if key == 'top':
                for secondKey in requiredValues['top']:
                    if not isinstance(
                            view[secondKey],
                            requiredValues['top'][secondKey]) and not isinstance(
                            view[secondKey],
                            'n/a'):
                        Logger.error(
                            "%s must be of type %s", secondKey, str(
                                requiredValues['top'][secondKey]))
                        return False
                    continue
            else:
                for item in requiredValues[key].keys():
                    if len(view[key]) > 0:

                        if isinstance(view[key], dict):
                            if not isinstance(
                                    view[key][item],
                                    requiredValues[key][item]) and not isinstance(
                                    view[key][item],
                                    'n/a'):
                                Logger.error("%s for %s must be of type %s",
                                             item,
                                             str(view[key][item]),
                                             str(requiredValues[key][item]))
                                return False
                            continue
                        else:
                            for myHash in view[key]:
                                if not isinstance(
                                        myHash.get(item),
                                        requiredValues[key][item]) and not isinstance(
                                        myHash.get(item),
                                        'n/a'):
                                    Logger.error(
                                        "%s for %s must be of type %s", item, str(
                                            myHash[item]), str(
                                            requiredValues[key][item]))
                                    return False
                                continue
    if not sawDefault:
        Logger.error("Default view required")
        return False
    return True
