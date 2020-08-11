"""Custom guage exmaple"""
from kivy.logger import Logger
from kivy.uix.relativelayout import RelativeLayout
from kivy.lang import Builder
from kivy.uix.label import Label

# KV Styling, here we set color of our text
Builder.load_string("""
<MyCustomLabel>:
      color: 1, 0, 0, 1
""")

class MyCustomLabel(Label):
    """Custom label class"""

    def set_data(self, val) -> None:
        """Method to subscribe for data"""
        Logger.info("Custom gauge setData method called, got: %s", val)


class Custom():
    """Custom gauge"""
    def __init__(self):
        super(Custom, self).__init__()
        Logger.info("Instantiate new custom gauge")

    def build_component(self, **ARGS) -> []:
        """Function that is called when gauge is created"""
        self.container = ARGS['container']
        live_widgets = []

        label = MyCustomLabel(text='Custom gauge!')

        # Use Kivy RelativeLayout as our gauge layout
        layout = RelativeLayout()

        # This bit is needed to add your gauge to the main layout
        layout.add_widget(label)
        self.container.add_widget(layout)

        # We can add out label here if we'd like it to receive data
        live_widgets.append(label)

        # Need to provide a pid attribute for our label to update from,
        # see static/constants.py
        label.pid = '0x0C'

        return live_widgets
