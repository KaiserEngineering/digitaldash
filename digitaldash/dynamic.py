from functools import lru_cache
from kivy.logger import Logger
from typing import Tuple

class Dynamic(object):
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

    def new( self, **args ) -> Tuple:
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
        if ( len(list(filter(lambda key: ( args.get(key, 'missing') == 'missing' ), ['value', 'op', 'index', 'priority', 'pid']))) ):
            return ( 0, "Missing required args for new dynamic object" )

        self.value     = int(args.get('value'))
        self.op        = args.get('op')
        self.index     = int(args.get('index'))
        self.priority  = int(args.get('priority'))
        self.pid       = args.get('pid', '')

        return ( 1, "New dynamic object successfully created" )

    @lru_cache(maxsize=512)
    def check(self, value) -> bool:
        """
        Args:
          self (<digitaldash.dynamic>) : Current dynamic object
          value (float): Value to perform comparison against
        """
        if value == value:
            return (eval(str(value) + self.op + str(self.value)))
        return 0

    def change(self, App) -> bool:
        """
        Perform view change

        Args:
          self (<digitaldash.dynamic>) : The current Dynamic object
          App (<GUI>) : The main application object
        """
        (ret, msg) = App.data_source.UpdateRequirements( App, App.views[self.index]['pids'] )
        if not ret: Logger.error( "Could not update requirements from dynamic: %s" % msg )

        App.app.clear_widgets()
        App.background.clear_widgets()
        App.alerts.clear_widgets()

        (App.background, App.background_source, App.alerts, App.ObjectsToUpdate, App.pids) = App.views[self.index].values()

        App.background.add_widget(App.containers[self.index])
        App.background.add_widget(App.alerts)

        # Sort our dynamic and alerts callbacks by priority
        App.dynamic_callbacks = sorted(App.callbacks['dynamic'], key=lambda x: x.priority, reverse=True)
        App.alert_callbacks   = sorted(App.callbacks[App.current], key=lambda x: x.priority, reverse=True)

        App.app.add_widget(App.background)

        return True
