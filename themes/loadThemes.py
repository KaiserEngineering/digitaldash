import os
import json

with open( 'themeDirectories.txt' ) as f:
    root = f.readlines()

themes = {}

for dir in root:
    dirlist = [item for item in os.listdir(dir.rstrip()) if os.path.isdir(os.path.join(dir.rstrip(), item))]
    for folder in dirlist:
        themes[folder] = dir.rstrip() + '\\' + folder

with open('themes.json', 'w') as outfile:
    json.dump(themes, outfile, indent=4)