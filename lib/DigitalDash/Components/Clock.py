from lib.DigitalDash.Base import KELabel
from lib.DigitalDash.Base import Face
import datetime
from kivy.logger import Logger
from kivy.animation import Animation

class Clock(KELabel):
    def __init__(self):
        super(Clock, self).__init__()
        self.text        = '12:00'

    def setData(self, val) -> None:
        now = datetime.datetime.now()
        self.text  = str(now.hour)+":"+str(now.minute)
        self.color = (0, 0, 0, 1)
        self.font_size = 45

    def build(self, **ARGS) -> []:
        self.container = ARGS['container']
        self.Layout.id = "Widgets-Layout-Clock"

        gauge = Face(path='static/imgs/Clock/')
        if gauge._coreimage:
            self.Layout.add_widget(gauge)
        else:
            Logger.info( "GUI: Could not load gauge image: 'static/imgs/Clock/ClockFace.png'" )

        anim = Animation(color=(1, 0, 0, 1))
        anim += Animation(color=(1, 1, 1, 1))
        anim += Animation(font_size=25)
        anim += Animation(font_size=55)
        anim.repeat = True
        anim.start(self)

        self.Layout.add_widget(self)
        self.container.add_widget(self.Layout)

        self.liveWidgets.append(self)

        return self.liveWidgets
