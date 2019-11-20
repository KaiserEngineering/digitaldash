from lib.DigitalDash.Base import Base
from lib.DigitalDash.Base import Gauge
from lib.DigitalDash.Base import KELabel

class Rally(Base):

    def setData(self, val) -> None:
        pass

    def build(self, **ARGS) -> []:
        self.container = ARGS['container']
        self.Layout.id = "Widgets-Layout-Rally"

        gauge = Gauge("static/imgs/Rally/", {})
        if gauge._coreimage:
            self.Layout.add_widget(gauge)

        label = KELabel({"default": "hello", "pos": [100, 100]})

        # self.Layout.add_widget(label)
        self.container.add_widget(self.Layout)

        return self.liveWidgets
