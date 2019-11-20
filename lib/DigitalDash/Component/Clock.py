from kivy.uix.label import Label
from kivy.uix.relativelayout import RelativeLayout
import datetime

class Clock(Label):
    def __init__(self):
        super(Clock, self).__init__()
        self.liveWidgets = []
        self.text        = '12:00'
        self.dataIndex   = 0

    def setData(self, val) -> None:
        now = datetime.datetime.now()
        self.text = str(now.hour)+":"+str(now.minute)

    def build(self, **ARGS) -> []:
        container   = ARGS['container']
        Layout      = RelativeLayout()
        Layout.id = "Widgets-Layout-Clock"

        Layout.add_widget(self)
        container.add_widget(Layout)

        self.liveWidgets.append(self)

        return self.liveWidgets
