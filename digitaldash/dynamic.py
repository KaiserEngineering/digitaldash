"""Dynamic class used for changing views"""
from typing import Tuple
import ast
from functools import lru_cache
from kivy.logger import Logger

class Dynamic():
    """
    The dynamic class is applied on per view, where the dynamic object has
    the ability to change the current active view to the linked view.
    """

    def __init__(self):
        """
        Create Dynamic widget.
            :param self: Dynamic object
            :param args: {
                    value     : <Float>,
                    op        : <String>,
                    index     : <Int>,
                    priority  : <Int>,
                    pid       : <Int>,
                }
        """
        super(Dynamic, self).__init__()
        self.buffer = 0

    def new(self, **args) -> Tuple:
        """
        We use 'new' here so that we can return a failure notice

        TODO: This is most likely not a Python best practice.

        Args:
          value (int)    : The value that we will perform our comparison against.
          op (str)       : Operator for comparison ie '<', '>', '='
          index (int)    : The index of the view (view.id) the dynamic instance is tied to
          priority (int) : This is used to determine order of dynamic checks
          pid            : The pid to get a value to compare to the 'value' arg provided
        """
        if len(list(filter(lambda key:
                           (args.get(key, 'missing') == 'missing'),
                           ['value', 'op', 'index', 'priority', 'pid']))) > 0:
            return (0, "Missing required args for new dynamic object")

        self.value = float(args.get('value'))
        self.op = args.get('op')
        self.index = int(args.get('index'))
        self.priority = int(args.get('priority'))
        self.pid = args.get('pid', '')

        return (1, "New dynamic object successfully created")

    @lru_cache(maxsize=512)
    def check(self, value) -> bool:
        """
        Args:
          self (<digitaldash.dynamic>) : Current dynamic object
          value (float): Value to perform comparison against
        """
        test = str(value) + self.op + str(self.value)
        return eval(test)

    def change(self, app) -> bool:
        """
        Perform view change

        Args:
          self (<digitaldash.dynamic>) : The current Dynamic object
          app (<GUI>) : The main application object
        """
        (ret, msg) = app.data_source.update_requirements(app, app.views[self.index]['pids'])
        if not ret:
            Logger.error("Could not update requirements from dynamic: %s", msg)

        app.app.clear_widgets()
        app.background.clear_widgets()
        app.alerts.clear_widgets()

        (app.background, app.background_source, app.alerts,
         app.ObjectsToUpdate, app.pids) = app.views[self.index].values()

        app.background.add_widget(app.containers[self.index])
        app.background.add_widget(app.alerts)

        # Sort our dynamic and alerts callbacks by priority
        app.dynamic_callbacks = sorted(app.callbacks['dynamic'],
                                       key=lambda x: x.priority, reverse=True)
        app.alert_callbacks = sorted(app.callbacks[app.current],
                                     key=lambda x: x.priority, reverse=True)

        app.app.add_widget(app.background)

        return True
