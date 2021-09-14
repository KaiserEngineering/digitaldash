"""Build our JSON file of a list of themes"""

import os
import json
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())

themes = []

def getThemes():
    """Return a list of our themes."""
    for folder in os.listdir( WORKING_PATH ):
        if os.path.isdir(os.path.join( WORKING_PATH, folder )):
            if folder in ("Error", "Clock" ):
                continue
            themes.append( folder )
    return themes


with open(WORKING_PATH+'/themes.json', 'w', encoding='utf-8') as outfile:
    json.dump(getThemes(), outfile, indent=4)
