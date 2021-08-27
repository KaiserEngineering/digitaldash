"""Build our JSON file of a list of themes"""

import os
import json
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())

themes = []

for folder in os.listdir( WORKING_PATH ):
    if os.path.isdir(os.path.join( WORKING_PATH, folder )):
        if folder in ("Error", "Clock" ):
            continue
        themes.append( folder )

with open(WORKING_PATH+'/themes.json', 'w', encoding='utf-8') as outfile:
    json.dump(themes, outfile, indent=4)
