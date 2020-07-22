from functools import lru_cache
from kivy.logger import Logger
"""Dynamic widget will monitour a specified value and make a view change."""

class Dynamic(object):
    """
    Dynamic class for changing cached views. Use this class to switch between the
    views in **views[]**.
        :param object:
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

    def new( self, **args ):
        if ( len(list(filter(lambda key: ( args.get(key, 'missing') == 'missing' ), ['value', 'op', 'index', 'priority', 'pid']))) ):
            return ( 0, "Missing required args for new dynamic object" )

        self.value     = int(args.get('value'))
        self.op        = args.get('op')
        self.index     = int(args.get('index'))
        self.priority  = int(args.get('priority'))
        self.pid       = args.get('pid', '')

        return ( 1, "New dynamic object successfully created" )

    @lru_cache(maxsize=512)
    def check(self, value):
        """
        Check logic here.
            :param self: Dynamic object
            :param value: value to check Dynamic condition against
        """
        if value == value:
            return (eval(str(value) + self.op + str(self.value)))
        return 0

    def change(self, App, callback):
        """
        Perform view change
            :param self: <DigitalDash.Dynamic.Dynamic>
            :param App: <DigitalDash> main application object
            :param callback: current callback object
        """
        (ret, msg) = App.data_source.UpdateRequirements( App, App.views[callback.index]['pids'] )
        if not ret: Logger.error( "Could not update requirements from dynamic: %s" % msg )

        App.app.clear_widgets()
        App.background.clear_widgets()
        App.alerts.clear_widgets()

        (App.background, App.background_source, App.alerts, App.ObjectsToUpdate, App.pids) = App.views[callback.index].values()

        App.background.add_widget(App.containers[callback.index])
        App.background.add_widget(App.alerts)

        # Sort our dynamic and alerts callbacks by priority
        App.dynamic_callbacks = sorted(App.callbacks['dynamic'], key=lambda x: x.priority, reverse=True)
        App.alert_callbacks   = sorted(App.callbacks[App.current], key=lambda x: x.priority, reverse=True)

        App.app.add_widget(App.background)

        return True
