from lib.DigitalDash.Abstractor import Base
from lib.DigitalDash.Components import Gauge

class Rally(Base):

    def setData(self, val) -> None:
        pass

    def build(self, **ARGS) -> []:
        self.container = ARGS['container']
        self.Layout.id = "Widgets-Layout-Rally"

        # gauge = Gauge(path, args)
        # if gauge._coreimage:
        #     self.Layout.add_widget(gauge)

        # needleType = args['module']
        # needle = globals()['Needle' + needleType](path,
        #                                           args['args'], themeConfig)

        # needle.dataIndex = args['dataIndex']

        # # Adding widgets that get updated with data
        # self.liveWidgets.append(needle)

        # # Add widgets to our floatlayout
        # self.Layout.add_widget(needle)

        # # Set step after we are added to parent layout
        # needle.SetStep()
        # needle.SetOffset()

        # labels = []
        # # Create our labels
        # for labelConfig in themeConfig['labels']:
        #     labelConfig['dataIndex'] = args['dataIndex']
        #     labelConfig['PID'] = ARGS['pids'][args['dataIndex']]

        #     # Create Label widget
        #     label = KELabel(labelConfig)
        #     labels.append(label)

        #     # Add to data recieving widgets
        #     if (labelConfig['data']):
        #         self.liveWidgets.append(label)

        #     self.Layout.add_widget(label)

        # self.container.add_widget(self.Layout)

        return self.liveWidgets
