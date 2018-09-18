"""Dynamic widget will monitour a specified value and make a view change."""


class Dynamic(object):
    """
    Dynamic class for changing cached views. Use this class to switch between the
    views in **views[]**.
        :param object: 
    """

    def __init__(self, args):
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

        self.value = int(args['value'])
        self.op = args['op']
        self.index = int(args['index'])
        self.priority = int(args['priority'])
        self.dataIndex = int(args['dataIndex'])

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
        App.app.clear_widgets()
        App.app.add_widget(App.containers[callback.index])

        return True
