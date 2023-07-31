"""Mehtods for getting Config data."""
# pylint: disable=global-statement
# pylint: disable=too-many-nested-blocks
# pylint: disable=too-many-branches
# pylint: disable=broad-except

import json
import sys
from kivy.logger import Logger

WORKINGPATH = ""


def setWorkingPath(path):
    """Simple setter"""
    global WORKINGPATH
    WORKINGPATH = path


def views(file=None, jsonData=None):
    """Get data from JSON."""
    # This is for tests so its fine to just die on error
    if jsonData:
        valid, error = validateConfig(jsonData)

        if not valid:
            sys.exit(error)

        return jsonData

    # Allow for a file to be submitted in place of default config, this is
    # useful for tests
    if file is None or file == "":
        file = WORKINGPATH + "/etc/config.json"

    jsonData = {}
    errorConfig = """
    {"views": { "0": {
              "alerts": [{
          "pid": "0x010C",
          "op": ">=",
          "value": -9999,
          "unit": "PID_UNITS_RPM",
          "priority": 1,
          "message": "Config file isn't valid!"
        }], "default": 1, "theme": "Error", "background": "Black.png",
              "dynamic": {},"gauges": [], "name": "Error", "enabled": 1}}}
          """
    try:
        with open(file, encoding="utf-8") as dataFile:
            jsonData = json.load(dataFile)

            dataFile.close()

        valid, error = validateConfig(jsonData)

        if not valid:
            Logger.error(error)
            errorConfig = errorConfig.replace(
                "Config file isn't valid!", error
            )
            jsonData = json.loads(errorConfig)

    except Exception as e:
        # We can shorten the error message by removing the trace/line the
        # error happened on.
        errorString = (str(e).split(":", maxsplit=1))[0]
        errorConfig = errorConfig.replace(
            "Config file isn't valid!",
            "Config file isn't valid! Exception Error",
        )
        Logger.error(
            "GUI: Invalid config provided, falling back to default: %s",
            errorString,
        )
        jsonData = json.loads(errorConfig)
    return jsonData


def getThemeConfig(theme):
    """Get theme specific config values."""
    jsonData = {}

    try:
        with open(
            WORKINGPATH + "/themes/" + theme + "/config.json", encoding="utf-8"
        ) as dataFile:
            jsonData = json.load(dataFile)

            dataFile.close()
    except FileNotFoundError:
        Logger.info(
            "Config: \
            Could not find config file: /%s/themes/%s/config.json",
            WORKINGPATH,
            theme,
        )

    return jsonData


def validateConfig(config):
    """Validate config."""

    requiredValues = {
        "top": {
            "name": str,
            "enabled": None | bool | str,
            "background": str,
            "dynamic": dict,
            "alerts": list,
            "gauges": list,
            "dynamicMinMax": None | bool | str,
        },
        "alerts": {
            "pid": str,
            "op": str,
            "value": str | int,
            "unit": str,
            "priority": str | int,
            "message": str,
        },
        "gauges": {"theme": str, "pid": str, "unit": str},
        "dynamic": {
            "enabled": None | bool | str,
            "pid": str,
            "op": str,
            "priority": str | int,
            "value": str | int,
            "unit": str,
        },
    }

    error = "Config file isn't valid! Unexpected Failure"

    sawDefault = False
    for Id in config["views"]:
        view = config["views"][Id]

        if "default" in view and view["default"]:
            sawDefault = True

        # Top level keys
        for myTuple in requiredValues.items():
            (key, value) = myTuple
            if key not in view and not key == "top":
                error = f"{key} required for view"
                return False, error
            if key == "top":
                for secondKey in requiredValues["top"]:
                    if (
                        not isinstance(
                            view[secondKey], requiredValues["top"][secondKey]
                        )
                        and not view[secondKey] == "n/a"
                    ):
                        error = f'{secondKey} must be of type \
                          {requiredValues["top"][secondKey]}'
                        return False, error
            else:
                for item in value.keys():
                    if len(view[key]) > 0:
                        if isinstance(view[key], dict):
                            if (
                                not isinstance(view[key][item], value[item])
                                and not view[key][item] == "n/a"
                            ):
                                error = f"{item} \
                                for{view[key][item]} must be of type {value[item]}"
                                return False, error
                        else:
                            for myHash in view[key]:
                                if (
                                    not isinstance(
                                        myHash.get(item), value[item]
                                    )
                                    and not myHash.get(item) == "n/a"
                                ):
                                    error = f"{item} for {myHash[item]} \
                                      must be of type {value[item]}"
                                    return False, error
    if not sawDefault:
        error = "Default view required"
        return False, error
    return True, "Config file is valid!"
