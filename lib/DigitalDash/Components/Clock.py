from lib.DigitalDash.Base import KELabel
import datetime

class Clock(KELabel):
    def __init__(self, args):
        super(Clock, self).__init__(args)
        self.text        = '12:00'

    def setData(self, val) -> None:
        now = datetime.datetime.now()
        self.text = str(now.hour)+":"+str(now.minute)

    def build(self, **ARGS) -> []:
        self.container = ARGS['container']
        self.Layout.id = "Widgets-Layout-Clock"

        self.Layout.add_widget(self)
        self.container.add_widget(self.Layout)

        self.liveWidgets.append(self)

        return self.liveWidgets
