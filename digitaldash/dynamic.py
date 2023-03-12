"""Dynamic class used for changing views"""
from typing import Tuple
from kivy.logger import Logger
from digitaldash.pid import PID
from digitaldash.base import convertOpToBytes


class Dynamic:
    """
    The dynamic class is applied on per view, where the dynamic object has
    the ability to change the current active view to the linked view.
    """

    value: float
    op: str
    viewId: int
    priority: int
    pid: PID

    def __init__(self):
        """
        Create Dynamic widget.
            :param self: Dynamic object
            :param args: {
                    value     : <Float>,
                    op        : <String>,
                    viewId    : <Int>,
                    priority  : <Int>,
                    pid       : <Int>,
                }
        """

        super().__init__()
        self.buffer = 0

    def new(self, **args) -> Tuple:
        """
        We use 'new' here so that we can return a failure notice

        TODO: This is most likely not a Python best practice.

        Args:
          value (int)    : The value that we will perform our comparison against.
          op (str)       : Operator for comparison ie '<', '>', '='
          viewId (int)   : The index of the view (view.id)
          priority (int) : This is used to determine order of dynamic checks
          pid            : The pid to get a value to compare to the 'value' arg provided
        """
        if (
            len(
                list(
                    filter(
                        lambda key: (args.get(key, "missing") == "missing"),
                        ["value", "op", "viewId", "priority", "pid"],
                    )
                )
            )
            > 0
        ):
            return (0, "Missing required args for new dynamic object")

        self.value = float(args.get("value"))

        convertOpToBytes(self, args)

        self.viewId = int(args.get("viewId"))
        self.priority = int(args.get("priority"))
        self.pid = args.get("pid", "")

        return (1, "New dynamic object successfully created")

    def change(self, app) -> bool:
        """
        Perform view change

        Args:
          self (<digitaldash.dynamic>) : The current Dynamic object
          app (<GUI>) : The main application object
        """
        Logger.info("GUI: Dynamic change happening for view #%s", self.viewId)
        app.app.clear_widgets()
        app.background.clear_widgets()
        app.alerts.clear_widgets()

        (
            app.background,
            app.alerts,
            app.objectsToUpdate,
            app.pids,
            app.pid_byte_code,
        ) = app.views[str(self.viewId)].values()

        app.background.add_widget(app.containers[str(self.viewId)])
        app.background.add_widget(app.alerts)

        # Add back our version labels
        app.background.add_widget(app.version_layout)

        # Sort our dynamic and alerts callbacks by priority
        app.dynamic_callbacks = sorted(
            app.callbacks["dynamic"], key=lambda x: x.priority
        )
        app.alert_callbacks = sorted(
            app.callbacks[str(app.current)], key=lambda x: x.priority
        )

        app.app.add_widget(app.background)

        (ret, msg) = app.data_source.updateRequirements(
            app, app.pid_byte_code, app.pids
        )
        if not ret:
            Logger.error("Could not update requirements from dynamic: %s", msg)

        return True
