"""Abstract classes."""
# pylint: disable=unused-import
# pylint: disable=too-few-public-methods
# pylint: disable=unused-import
# pylint: disable=fixme

from typing import List

from kivy.logger import Logger

from etc import config
from digitaldash.gauge import Gauge
from digitaldash.face import Face
from digitaldash.keLabel import KELabel

from digitaldash.needles.ellipse import NeedleEllipse as Ellipse
from digitaldash.needles.static import NeedleStatic as Static
from digitaldash.needles.radial import NeedleRadial as Radial
from digitaldash.needles.linear import NeedleLinear as Linear


class Base:
    """Base class used to provide helper method for creating a gauge."""

    def __init__(self):
        super().__init__()
        # Optional values
        self.liveWidgets = []
        self.container = None
        self.needle = None
        self.face = None
        self.gauge = None

    def buildComponent(self, container, **ARGS) -> List:
        """
        Create widgets for Dial.
            :param **ARGS:
        """
        self.container = container
        args = {}
        notError = ARGS["theme"] != "Error"

        # Import theme specifc Config
        themeConfig = config.getThemeConfig(ARGS["theme"])
        args["themeConfig"] = {**ARGS, **themeConfig}

        self.needle = None
        if notError:
            self.needle = globals()[themeConfig["module"]](
                **ARGS, **themeConfig
            )
            (self.needle.sizex, self.needle.sizey) = (512, 512)
            self.needle.pid = ARGS["pid"]
            # Adding widgets that get updated with data
            self.liveWidgets.append(self.needle)
        self.face = Face(**args, workingPath=ARGS.get("workingPath", ""))

        self.gauge = Gauge(face=self.face, needle=self.needle)
        self.container.add_widget(self.face)

        # Needle needs to be added after so its on top
        if self.needle:
            self.container.add_widget(self.needle)

        # Create our labels
        for labelConfig in themeConfig["labels"]:
            labelConfig["pid"] = ARGS["pid"]

            # FIXME
            # This is a bandaid on the issue of spacing for linear gauges
            if (
                ARGS["skipLinearMinMax"]
                and themeConfig["module"]
                and (labelConfig.get("Min") or labelConfig.get("Max"))
            ):
                Logger.info(
                    "GUI: Received skipLinearMinMax flag, \
                    removing Min/Max labels from Linear gauges"
                )
                continue
            # FIXME

            # remove duplicate "default" config option from main config
            tempArgs = dict(ARGS)
            tempArgs.pop("default", None)
            labelConfig = {**tempArgs, **labelConfig}

            # Create Label widget
            label = KELabel(
                **labelConfig,
                gauge=self.gauge,
                min=self.needle.minValue if self.needle else 0,
            )
            self.gauge.labels.append(label)

            # Add to data recieving widgets
            if "data" in labelConfig and labelConfig["data"]:
                # Don't update our Min/Max labels if they are static
                if (label.isMax or label.isMin) and not ARGS["dynamicMinMax"]:
                    if label.isMax:
                        label.text = (
                            str(label.pid.range["Max"])
                            + "[size=15]"
                            + " "
                            + label.unitString
                            + "[/size]"
                        )
                    else:
                        label.text = (
                            str(label.pid.range["Min"])
                            + "[size=15]"
                            + " "
                            + label.unitString
                            + "[/size]"
                        )
                else:
                    self.liveWidgets.append(label)
            self.container.add_widget(label)

        return self.liveWidgets


def convertOpToBytes(self, args):
    """Convert op code to bytecode, this is used for Rust."""
    if len(args.get("op")) == 2:
        operator = bytearray(args.get("op").encode())
        self.op = (operator[0] << 8) | (operator[1] & 0xFF)
    else:
        operator = " " + str(args.get("op"))
        operator = bytearray(operator.encode())
        self.op = (operator[0] << 8) | (operator[1] & 0xFF)
