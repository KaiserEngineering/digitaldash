"""This is where the magic happens."""
# pylint: disable=unused-import
# pylint: disable=unused-wildcard-import
# pylint: disable=wildcard-import
# pylint: disable=wildcard-import
# pylint: disable=too-many-locals
# pylint: disable=too-many-branches
# pylint: disable=too-many-statements


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

# Import custom gauges
from local.gauges import *


class Background(AnchorLayout):
    """Uses Kivy language to create background."""

    source = StringProperty()

    def __init__(self, BackgroundSource="", WorkingPath=""):
        super().__init__()
        Logger.debug(
            "GUI: Creating new Background obj with source: %s", BackgroundSource
        )
        self.source = f"{WorkingPath + '/static/imgs/Background/'}{BackgroundSource}"


def findPids(view):
    """Find all PIDs in a view"""
    pidsDict = {}
    for i, gauge in enumerate(view["gauges"]):
        pidsDict[gauge["pid"]] = PID(**gauge)
        view["gauges"][i]["pid"] = pidsDict[gauge["pid"]]

    for i, alert in enumerate(view["alerts"]):
        if alert["pid"] in pidsDict:
            continue
        pidsDict[alert["pid"]] = PID(**alert)
        view["alerts"][i]["pid"] = pidsDict[alert["pid"]]

    return list(pidsDict.values())


def findUnits(view):
    """Create a dictionary of PIDs and their corresponding unit"""
    units = {}
    for gauge in view["gauges"]:
        units[gauge["pid"]] = gauge["unit"]
    for alert in view["alerts"]:
        units[alert["pid"]] = alert["unit"]
    if view["dynamic"] and view["dynamic"]["enabled"]:
        units[view["dynamic"]["pid"]] = view["dynamic"]["unit"]
    return units


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
    dynamicPids = {}
    # Currently we only allow one type of units per PID
    units = {}

    # Sort based on default value
    for Id in layouts["views"]:
        Logger.info("GUI: Starting on view %s", Id)
        # Make sure a callback key exist for each view Id
        callbacks.setdefault(Id, [])

        view = layouts["views"][Id]
        # Skip disabled views
        if not view["enabled"]:
            Logger.info("GUI: Skipping view %s as it is marked as disabled", Id)
            continue

        # FIXME
        # This is a bandaid on the issue of spacing for linear gauges
        skipLinearMinMax = False
        linearCount = 0
        for gauge in view['gauges']:
            if gauge['theme'] == 'Bar (Red)':
                linearCount = linearCount + 1
        if linearCount > 1:
            skipLinearMinMax = True
        # FIXME

        pids = findPids(view)
        units = {**units, **findUnits(view)}

        background = view["background"]

        # Create our callbacks
        if view["dynamic"].keys():
            dynamicConfig = view["dynamic"]
            if dynamicConfig["enabled"]:
                dynamicConfig["viewId"] = Id

                # Keep track of our dynamic PIDs
                dynamicPID = PID(**dynamicConfig)
                if not dynamicPID.value:
                    Logger.error("GUI: Bailing out: Couldn't set dynamic PID")
                    return (0, "Couldn't set dynamic PID")
                # We only will ever have one dynamic PID right?
                dynamicPids[Id] = dynamicPID

                # Replace our string pid value with our new object
                dynamicConfig["pid"] = dynamicPID

                dynamicObj = Dynamic()
                (ret, msg) = dynamicObj.new(**dynamicConfig)
                if ret:
                    callbacks.setdefault("dynamic", []).append(dynamicObj)
                else:
                    Logger.error(msg)
                    callbacks.setdefault("dynamic", [])

        if len(view["alerts"]) > 0:
            for alert in view["alerts"]:
                alert["viewId"] = Id

                # Get our already created PID object
                for pid in pids:
                    if pid.value == alert["pid"]:
                        alert["pid"] = pid
                        break

                callbacks.setdefault(Id, []).append(Alert(**alert))
        else:
            callbacks.setdefault(Id, [])

        container = FloatLayout( pos_hint={'center_y': 0.5, 'center_x': 0.5} )
        objectsToUpdate = []

        numGauges = len(view["gauges"]) or 1

        if numGauges == 1:
            xPosition = [ 0.5 ]
            yTop = [ 0.99 ]
        elif numGauges == 2:
            xPosition = [ 0.33, 0.66 ]
            yTop = [ 0.985, 0.99 ]
        elif numGauges == 3:
            xPosition = [ 0.20, 0.5, 0.80 ]
            yTop = [ 0.98, 0.985, 0.99 ]

        for count, widget in enumerate(view["gauges"]):
            if count > 3:
                break

            # This handles our gauge positions, see the following for reference:
            # https://kivy.org/doc/stable/api-kivy.uix.floatlayout.html#kivy.uix.floatlayout.FloatLayout
            subcontainer = RelativeLayout(
                pos_hint={'top': yTop[count], 'center_x': xPosition[count]},
                size_hint_max_y=200,
                size_hint_max_x=Window.width / numGauges,
            )
            container.add_widget(subcontainer)

            module = None
            try:
                # This loads any standalone modules
                module = globals()[widget["module"]]()
            except KeyError:
                module = Base()
            objectsToUpdate.append(
                module.buildComponent(
                    skipLinearMinMax=skipLinearMinMax,
                    workingPath=self.WORKING_PATH,
                    container=subcontainer,
                    view_id=Id,
                    xPosition=xPosition[count],
                    **widget,
                    **view,
                )
            )

        containers[Id] = container

        views[Id] = {
            "app": Background(
                WorkingPath=self.WORKING_PATH, BackgroundSource=background
            ),
            "alerts": FloatLayout(),
            "objectsToUpdate": objectsToUpdate,
            "pids": pids,
        }

    # We need to retro-actively add our dynamic PIDs into the PIDs array per view
    for viewId in views:
        # Check if we have any dynamic PIDs for the other views
        for dynamicPIDKeys in dynamicPids:
            if dynamicPIDKeys != str(viewId):
                pid = dynamicPids[dynamicPIDKeys]
                if pid not in views[viewId]["pids"]:
                    views[viewId]["pids"].append(pid)

        # Now we can generate a complete byte array for the PIDs
        if len(views[viewId]["pids"]) > 0 or views[viewId]["pids"][0] != "n/a":
            views[viewId]["pid_byte_code"] = buildUpdateRequirementsBytearray(
                views[viewId]["pids"]
            )
        else:
            Logger.info("GUI: No pid_byte_code generated for view #%s", viewId)
            views[viewId]["pid_byte_code"] = ""

    return ([views, containers, callbacks], "Successful setup")


def buildFromConfig(self, dataSource=None) -> [int, AnchorLayout, str]:
    """Build all our gauges and widgets from the config file provided to self"""
    self.success = 0
    self.status  = ""

    # Current is used to track which viewId we are currently displaying.
    # This is important for skipping dynamic checks that we don't need to check.
    self.current = 0
    self.first_iteration = not hasattr(self, "first_iteration")

    # We need to clear the widgets before rebuilding or else we must face
    # the segfault monster.
    if not self.first_iteration:
        Logger.info( "GUI: Clearing widgets for reload" )
        self.app.clear_widgets()
        self.background.clear_widgets()
        self.alerts.clear_widgets()
        self.alert_callbacks = []
        self.dynamic_callbacks = []
        self.callbacks = {}

    (ret, msg) = setup(self, config.views(file=self.configFile))
    if ret:
        self.views, self.containers, self.callbacks = ret
    else:
        self.success = 0
        self.status = msg
        return

    # Sort our dynamic and alerts callbacks by priority
    self.dynamic_callbacks = sorted(
        self.callbacks["dynamic"], key=lambda x: x.priority
    )
    # Since we are building for the first time we can default to index 0
    self.alert_callbacks = sorted(
        self.callbacks["0"], key=lambda x: x.priority
    )

    (
        self.background,
        self.alerts,
        self.objectsToUpdate,
        self.pids,
        self.pid_byte_code,
    ) = self.views[next(iter(self.views))].values()
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
                    "Hardware: Running hardware restart, attempt :#%s", str(count)
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
    self.background.add_widget(self.containers[next(iter(self.containers))])
    self.background.add_widget(self.alerts)

    self.success = 1
    self.status = "Successful build"
