import os
import json
import pathlib

WORKING_PATH = str(pathlib.Path(__file__).parent.absolute())

themes = {}

dirlist = [item for item in os.listdir(WORKING_PATH.rstrip()) if os.path.isdir(os.path.join(WORKING_PATH.rstrip(), item))]
for folder in dirlist:
    themes[folder] = WORKING_PATH.rstrip() + '\\' + folder

with open('themes.json', 'w') as outfile:
    json.dump(themes, outfile, indent=4)