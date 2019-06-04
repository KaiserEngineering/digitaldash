"""Mehtods for getting Config data."""
import json

def layouts():
    """Get data from JSON."""
    jsonData = {}
    with open('etc/Config.json') as data_file:
        jsonData = json.load(data_file)

        data_file.close()


    return jsonData['view']


def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}
    with open('etc/Themes/' + theme + '.json') as data_file:
        jsonData = json.load(data_file)

        data_file.close()

    return jsonData

