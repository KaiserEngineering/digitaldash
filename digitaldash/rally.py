from digitaldash.base import Base
from digitaldash.gauge import Gauge
from digitaldash.ke_lable import KELabel
from digitaldash.needles.needle.ellipse import NeedleEllipse
from digitaldash.face import Face

class Rally(Base):

    def build(self, **args) -> []:
        self.container = args['container']
        self.Layout.id = "Widgets-Layout-Rally"

        self.face = Face(nocache=True, **args)
        self.needle = NeedleEllipse()
        (self.needle.sizex, self.needle.sizey) = (512, 512)

        self.gauge = Gauge(Face=self.face, Needle=self.needle)

        if self.gauge.face._coreimage:
            self.Layout.add_widget(self.gauge.face)

        label = KELabel(default = "hello", pos = [100, 100])

        # self.Layout.add_widget(label)
        self.container.add_widget(self.Layout)

        return self.liveWidgets
