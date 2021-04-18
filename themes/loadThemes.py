import os
import json
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())

themes = []

for folder in os.listdir( WORKING_PATH ):
    if os.path.isdir(os.path.join( WORKING_PATH, folder )):
        if folder == "Error" or folder == "Clock":
          continue
        themes.append( folder )

with open(WORKING_PATH+'/themes.json', 'w') as outfile:
    json.dump(themes, outfile, indent=4)
