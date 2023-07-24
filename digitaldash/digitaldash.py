"""This is where the magic happens."""
# pylint: disable=unused-import
# pylint: disable=unused-wildcard-import
# pylint: disable=wildcard-import
# pylint: disable=wildcard-import
# pylint: disable=too-many-locals
# pylint: disable=too-many-branches
# pylint: disable=too-many-statements
# pylint: disable=fixme


import copy
from typing import Any, List
from kivy.logger import Logger
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.relativelayout import RelativeLayout
from kivy.properties import StringProperty
from kivy.uix.anchorlayout import AnchorLayout
from kivy.core.window import Window

from etc import config
from digitaldash.base import Base
from digitaldash.test import Test
from digitaldash.dynamic import Dynamic
from digitaldash.alert import Alert
from digitaldash.alerts import Alerts
from digitaldash.pid import PID
from digitaldash.keProtocol import buildUpdateRequirementsBytearray
from digitaldash.keError import ConfigBuildError

# Import custom gauges
from local.gauges import *


class Background(AnchorLayout):
    """Uses Kivy language to create background."""

    source = StringProperty()

    def __init__(self, BackgroundSource="", WorkingPath=""):
        super().__init__()
        Logger.debug(
            "GUI: Creating new Background obj with source: %s",
            BackgroundSource,
        )
        self.source = (
            f"{WorkingPath + '/static/images/Background/'}{BackgroundSource}"
        )


# We want this variable to be shared across views
PIDS_LIST = []


def windowWidth():
    """Return window width, we use a function for testing"""
    return Window.width


def findPids(view):
    """Find all PIDs in a view"""
    for i, gauge in enumerate(view["gauges"]):
        if not gauge["pid"]:
            continue
        # Create a temp PID instance
        pid_object = PID(**gauge)

        # Do not create a new PID, as we want to share reference objects for same PIDs
        new_pid = True
        for pid in PIDS_LIST:
            if pid.value == pid_object.value and pid.unit == pid_object.unit:
                pid_object = pid
                new_pid = False
                break
        if new_pid:
            PIDS_LIST.append(pid_object)
        # Update our view string value to now be our PID object
        view["gauges"][i]["pid"] = pid_object

    for i, alert in enumerate(view["alerts"]):
        if not alert["pid"]:
            continue
        pid_object = PID(**alert)

        # Do not create a new PID, as we want to share reference objects for same PIDs
        new_pid = True
        for pid in PIDS_LIST:
            if pid.value == pid_object.value and pid.unit == pid_object.unit:
                pid_object = pid
                new_pid = False
                break
        if new_pid:
            PIDS_LIST.append(pid_object)
        # Update our view string value to now be our PID object
        view["alerts"][i]["pid"] = pid_object
    return PIDS_LIST


def findPidsForView(views: List[Any], Id: str):
    """Only return pids from the PIDS_LIST that apply to this view"""

    pids_list = []
    view = views[Id]

    for gauge in view["gauges"]:
        new_pid = True
        for pid in pids_list:
            if (
                pid.value == gauge["pid"].value
                and pid.unit == gauge["pid"].unit
            ):
                Logger.info(
                    f"Skipping gauge pid {gauge['pid'].value} as it was already found in PID list"
                )
                new_pid = False
                break
        if new_pid:
            Logger.info(
                "GUI: Adding alert PID `%s`:`%s for view #%s",
                gauge["pid"].value,
                gauge["pid"].unitLabel,
                Id,
            )
            pids_list.append(gauge["pid"])

    for alert in view["alerts"]:
        new_pid = True
        for pid in pids_list:
            if (
                pid.value == alert["pid"].value
                and pid.unit == alert["pid"].unit
            ):
                Logger.info(
                    f"GUI: Skipping alert pid {alert['pid'].value} as it was already found in PID list"
                )
                new_pid = False
                break
        if new_pid:
            Logger.info(
                "GUI: Adding alert PID `%s`:`%s for view #%s",
                alert["pid"].value,
                alert["pid"].unitLabel,
                Id,
            )
            pids_list.append(alert["pid"])

    # We need to retro-actively add our dynamic PIDs into the PIDs array per view
    for viewId in views:
        if views[viewId]["dynamic"] and views[viewId]["dynamic"]["enabled"]:
            # If we have a PID object, we are accounted for in our global PID_LIST,
            # since this is the only location we make the dynamic PIDs.
            if type(views[viewId]["dynamic"]["pid"]) is PID:
                # Add PID to our list of PIDs if not current view
                if viewId != Id:
                    pids_list.append(views[viewId]["dynamic"]["pid"])
            else:
                pid_object = PID(**views[viewId]["dynamic"])
                new_pid = True
                for pid in pids_list:
                    if (
                        pid.value == pid_object.value
                        and pid.unit == pid_object.unit
                    ):
                        Logger.info(
                            f"Skipping dynamic pid {pid_object.value} as it was already found in PID list"
                        )
                        new_pid = False
                        pid_object = pid
                        break
                if new_pid:
                    PIDS_LIST.append(pid_object)
                    if viewId != Id:
                        pids_list.append(pid_object)
                views[viewId]["dynamic"]["pid"] = pid_object
    return pids_list


# flake8: noqa: C901
def setup(self, layouts):
    """
    Build all widgets for DigitalDash.

    This method will collect config arguments for number/type and other
    values for views. Then it will build the views and return them.
    """

    # Callbacks are things like Dynamic objects and Alerts that we need to check
    callbacks = {"dynamic": []}
    views = {}
    containers = {}
    objectsToUpdate = {}

    # Sort based on default value
    for Id in layouts["views"]:
        Logger.info("GUI: Starting on view %s", Id)

        view = layouts["views"][Id]
        # Skip disabled views
        if not view["enabled"]:
            Logger.info(
                "GUI: Skipping view %s as it is marked as disabled", Id
            )
            continue

        # Make sure a callback key exist for each view Id
        callbacks.setdefault(Id, [])
        objectsToUpdate[Id] = []

        # FIXME
        # This is a bandaid on the issue of spacing for linear gauges
        skipLinearMinMax = False
        linearCount = 0
        for gauge in view["gauges"]:
            if gauge["theme"].startswith("Bar"):
                linearCount = linearCount + 1
        if linearCount > 1:
            skipLinearMinMax = True
        # FIXME

        # Update our global dictionary with new view values -- if any.
        Logger.info("GUI: Checking PIDs for view #%s", Id)

        findPids(view)
        Logger.info("GUI: Found #%s PIDs", len(PIDS_LIST))

        container = FloatLayout(pos_hint={"center_y": 0.5, "center_x": 0.5})

        numGauges = len(view["gauges"]) or 1

        if numGauges == 1:
            xPosition = [0.5]
            yTop = [0.99]
        elif numGauges == 2:
            xPosition = [0.33, 0.66]
            yTop = [0.985, 0.99]
        elif numGauges == 3:
            xPosition = [0.20, 0.5, 0.80]
            yTop = [0.98, 0.985, 0.99]

        for count, gauge in enumerate(view["gauges"]):
            if count > 3:
                break
            if not gauge["pid"] or not isinstance(gauge["pid"], PID):
                Logger.error(
                    "GUI: Skipping gauge %s for view %s as PID not found",
                    count,
                    Id,
                )
                continue

            # This handles our gauge positions, see the following for reference:
            # https://kivy.org/doc/stable/api-kivy.uix.floatlayout.html#kivy.uix.floatlayout.FloatLayout
            subcontainer = RelativeLayout(
                pos_hint={"top": yTop[count], "center_x": xPosition[count]},
                size_hint_max_y=200,
                size_hint_max_x=windowWidth() / numGauges,
            )
            container.add_widget(subcontainer)

            module = None
            try:
                # This loads any standalone modules
                module = globals()[gauge["module"]]()
            except KeyError:
                module = Base()
            objectsToUpdate[Id].append(
                module.buildComponent(
                    skipLinearMinMax=skipLinearMinMax,
                    workingPath=self.WORKING_PATH,
                    container=subcontainer,
                    view_id=Id,
                    xPosition=xPosition[count],
                    **gauge,
                    **view,
                )
            )
        containers[Id] = container

        background = layouts["views"][Id]["background"]

        # Set our alert callback
        if len(view["alerts"]) > 0:
            for alert in view["alerts"]:
                alert["viewId"] = Id
                callbacks.setdefault(Id, []).append(Alert(**alert))
        else:
            callbacks.setdefault(Id, [])

        pid_for_view = findPidsForView(layouts["views"], Id)

        # Set our dynamic callbacks, this has to be after we build our PID objects for dynamic
        # objects in `findPidsForView`.
        dynamicConfig = layouts["views"][Id]["dynamic"]
        if dynamicConfig and dynamicConfig["enabled"]:
            dynamicObj = Dynamic()
            dynamicConfig["viewId"] = Id

            (ret, msg) = dynamicObj.new(**dynamicConfig)
            if ret:
                callbacks.setdefault("dynamic", []).append(dynamicObj)
            else:
                Logger.error(msg)
                callbacks.setdefault("dynamic", [])

        views[Id] = {
            "app": Background(
                WorkingPath=self.WORKING_PATH, BackgroundSource=background
            ),
            "alerts": FloatLayout(),
            "objectsToUpdate": objectsToUpdate[Id],
            "pids": pid_for_view,
        }

        # Now we can generate a complete byte array for the PIDs
        if len(views[Id]["pids"]) > 0:
            views[Id]["pid_byte_code"] = buildUpdateRequirementsBytearray(
                views[Id]["pids"]
            )
        else:
            Logger.info("GUI: No pid_byte_code generated for view #%s", Id)
            views[Id]["pid_byte_code"] = ""
    return [views, containers, callbacks]


def clearWidgets(digitaldash, background=False):
    """
    Clear widgets from our DigitalDash instance, by default we don't
    clear the background.
    """
    digitaldash.app.clear_widgets()
    if background:
        digitaldash.background.clear_widgets()
    digitaldash.alerts.clear_widgets()
    digitaldash.alert_callbacks = []
    digitaldash.dynamic_callbacks = []
    digitaldash.callbacks = {}


def buildFromConfig(self, dataSource=None, views=None):
    """Build all our gauges and widgets from the config file provided to self"""

    # Current is used to track which viewId we are currently displaying.
    # This is important for skipping dynamic checks that we don't need to check.
    self.first_iteration = not hasattr(self, "first_iteration")

    if views is None:
        views = config.views(file=self.configFile, jsonData=self.jsonData)
    default_view_id = None
    for viewId in views["views"].keys():
        view = views["views"][viewId]
        if view["default"]:
            default_view_id = viewId
            Logger.info(
                "GUI: Found default view %s for default view", view["name"]
            )
            break
    if default_view_id is None:
        Logger.error("GUI: Failed to find a default View!")
        raise Exception("No default view found")
    self.current = default_view_id

    # We need to clear the widgets before rebuilding or else we must face
    # the segfault monster.
    if not self.first_iteration:
        Logger.info("GUI: Clearing widgets for reload")
        clearWidgets(self, background=True)

    ret = setup(self, views)
    self.views, self.containers, self.callbacks = ret

    # Sort our dynamic and alerts callbacks by priority
    self.dynamic_callbacks = sorted(
        self.callbacks["dynamic"], key=lambda x: x.priority
    )

    # Since we are building for the first time we need to set our current list of alerts
    # to our default view
    self.alert_callbacks = sorted(
        self.callbacks[default_view_id], key=lambda x: x.priority
    )

    (
        self.background,
        self.alerts,
        self.objectsToUpdate,
        self.pids,
        self.pid_byte_code,
    ) = self.views[default_view_id].values()
    # Grabbing our first key ^

    if self.first_iteration and dataSource and dataSource is not Test:
        # Initialize our hardware set-up and verify everything is peachy
        (ret, msg) = dataSource.initialize_hardware()

        if not ret:
            Logger.error("Hardware: Could not initialize hardware: %s", msg)
            count = 0
            # Loop in the restart process until we succeed
            while not ret and count < 3:
                Logger.error(
                    "Hardware: Running hardware restart, attempt :#%s",
                    str(count),
                )
                (ret, msg) = dataSource.initialize_hardware()

                if not ret:
                    count = count + 1
                    Logger.error(
                        "Hardware: Hardware restart attempt: #%s failed %s",
                        str(count),
                        msg,
                    )
        else:
            Logger.info(msg)
        self.data_source = dataSource
        (ret, msg) = dataSource.updateRequirements(
            self, self.pid_byte_code, self.pids
        )
        if not ret:
            Logger.error(msg)
    elif dataSource:
        # If we have a datasource we should update PIDs
        (ret, msg) = dataSource.updateRequirements(
            self, self.pid_byte_code, self.pids
        )
        if not ret:
            Logger.error(msg)

    self.app.add_widget(self.background)
    self.background.add_widget(self.containers[default_view_id])
    self.background.add_widget(self.alerts)

    Logger.info("GUI: Successful config build")
