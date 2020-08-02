from kivy.uix.label import Label
from digitaldash.face import Face
from kivy.logger import Logger
from kivy.uix.relativelayout import RelativeLayout
from digitaldash.base import Base
from kivy.lang import Builder

# KV Styling, here we set color of our text
Builder.load_string("""
<MyCustomLabel>:
      color: 1, 0, 0, 1
""")

class MyCustomLabel(Label):
    '''Custom label class'''

    def setData(self, val) -> None:
        Logger.info("Custom gauge setData method called")


class Custom():
    def __init__(self, pid=''):
        super(Custom, self).__init__()
        Logger.info("Instantiate new custom gauge")

    def buildComponent(self, **ARGS) -> []:
        self.container = ARGS['container']
        liveWidgets    = []

        label = MyCustomLabel(text='Custom gauge!')

        # Use Kivy RelativeLayout as our gauge layout
        layout = RelativeLayout()

        # This bit is needed to add your gauge to the main layout
        layout.add_widget(label)
        self.container.add_widget(layout)

        # We can add out label here if we'd like it to receive data
        liveWidgets.append(label)

        # Need to provide a pid attribute for our label to update from,
        # see static/constants.py
        label.pid = '0x0C'

        return liveWidgets
