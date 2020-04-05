from functools import lru_cache

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
                    dataIndex : <Int>,
                }
        """
        super(Dynamic, self).__init__()

    def new( self, **args ):
        if ( len(list(filter(lambda key: ( args.get(key, 'missing') == 'missing' ), ['value', 'op', 'index', 'priority', 'dataIndex']))) ):
            return ( 0, "Missing required args for new dynamic object" )

        self.value     = int(args.get('value'))
        self.op        = args.get('op')
        self.index     = int(args.get('index'))
        self.priority  = int(args.get('priority'))
        self.dataIndex = int(args.get('dataIndex'))

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

        App.data_source.UpdateRequirements(App.views[callback.index]['pids'])

        App.app.clear_widgets()
        App.background.clear_widgets()
        App.alerts.clear_widgets()

        (App.background, App.background_source, App.alerts, App.ObjectsToUpdate, App.pids) = App.views[callback.index].values()
        App.background.add_widget(App.containers[callback.index])
        App.background.add_widget(App.alerts)

        App.app.add_widget(App.background)

        return True
