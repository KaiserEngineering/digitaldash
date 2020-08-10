"""Simple Clock Example"""

from digitaldash.ke_label import KELabel
from digitaldash.face import Face
import datetime
from kivy.logger import Logger
from kivy.animation import Animation
from digitaldash.base import Base

class Clock(Base, KELabel):
    """Clock gauge"""
    def __init__(self):
        super(Clock, self).__init__()
        self.text = '12:00'

    def set_data(self, val) -> None:
        now = datetime.datetime.now()
        self.text = str(now.hour)+":"+str(now.minute)
        self.color = (0, 0, 0, 1)
        self.font_size = 45

    def build_component(self, **ARGS) -> []:
        self.container = ARGS['container']

        face = Face(path='/Clock/', working_path=ARGS.get('working_path', ''))
        if face._coreimage:
            self.container.add_widget(face)
        else:
            Logger.info("GUI: Could not load gauge image: 'Clock/Clock/gauge.png'")

        anim = Animation(color=(1, 0, 0, 1))
        anim += Animation(color=(1, 1, 1, 1))
        anim += Animation(font_size=25)
        anim += Animation(font_size=55)
        anim.repeat = True
        anim.start(self)

        self.container.add_widget(self)

        self.liveWidgets.append(self)

        return self.liveWidgets
