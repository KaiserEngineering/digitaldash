from lib.DigitalDash.Base import Base
from lib.DigitalDash.Base import Gauge
from lib.DigitalDash.Base import KELabel
from lib.DigitalDash.Base import NeedleEllipse

class Rally(Base):

    def build(self, **args) -> []:
        self.container = args['container']
        self.Layout.id = "Widgets-Layout-Rally"

        gauge = Gauge(path="static/imgs/Rally/")
        if gauge._coreimage:
            self.Layout.add_widget(gauge)

        label = KELabel(default = "hello", pos = [100, 100])

        # self.Layout.add_widget(label)
        self.container.add_widget(self.Layout)
        needle = NeedleEllipse()

        return self.liveWidgets
