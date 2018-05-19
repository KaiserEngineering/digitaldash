"""Dynamic widget will monitour a specified value and make a view change."""

import DigitalDash


class Dynamic(object):
    """
    Dynamic class for changing cached views. Use this class to switch between the
    views in **views[]**.
    """

    def __init__(self, args):
            """Create Dynamic widget."""
            super(Dynamic, self).__init__()

            self.value = int(args['value'])
            self.op = args['op']
            self.index = int(args['index'])
            self.priority = int(args['priority'])
            self.data = int(args['dataIndex'])

    def check(self, value):
        """Perform logic test."""
        return (eval(str(value) + self.op + str(self.value)))

    def change(self, App, callback):
        """Perform view change."""
        App.app.clear_widgets()
        App.app.add_widget(App.containers[callback.index])

