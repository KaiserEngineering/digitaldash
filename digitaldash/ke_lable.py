from typing import NoReturn, List, TypeVar
from kivy.uix.label import Label
from static.constants import KE_PID
from kivy.logger import Logger

KL = TypeVar('KL', bound='KELabel')
class KELabel(Label):
    """
    Create Label widget.

    Send a default value that will stay with the Label
    at all times 'default'.

        :param MetaWidget: <DigitalDash.Components.KELabel>

    If default value of label is set to '__PID__' then that string will
    be replaced with the PID name for the data index the label is for.
    """

    def __init__(self, **args):
        """Intiate Label widget."""
        super(KELabel, self).__init__()
        self.minObserved     = 9999
        self.maxObserved     = -9999
        self.default         = args.get('default', '')
        self.ConfigColor     = args.get('color', (1, 1, 1 ,1)) # White
        self.color           = self.ConfigColor
        self.ConfigFontSize  = args.get('font_size', 25)
        self.font_size       = self.ConfigFontSize
        self.decimals        = str(KE_PID.get(args.get('PID', ''), {}).get('decimals', 2))

        self.ObjectType   = 'Label'

        if ( self.default == '__PID__' ):
            try:
                self.default = str(KE_PID[args['PID']]['shortName'])
            except Exception as e:
                self.default = args.get('PID', '')
                Logger.error( "Could not load shortName from Static.Constants for PID: "+self.default+" : "+str(e) )
        self.text = self.default

        # Set position dynamically
        self.new_pos = list(map( lambda x: x / 100, args.get('pos', (0, 0)) ))

        if ( args.get('data', False) ):
            self.dataIndex = args['dataIndex']
            self.setData(args.get('min', 0))

    def setData(self: KL, value='') -> NoReturn:
        """
        Send data to Label widget.
        Check for Min/Max key words to cache values with regex checks.
            :param self: LabelWidget object
            :param value='': Numeric value for label
        """
        value = float(value)

        if ( self.default == 'Min: ' ):
            if ( self.minObserved > value ):
                self.minObserved = value
                self.text = ("{0:.%sf}"%(self.decimals)).format(value)
        elif ( self.default == 'Max: ' ):
            if ( self.maxObserved < value ):
                self.maxObserved = value
                self.text = ("{0:.%sf}"%(self.decimals)).format(value)
        else:
            self.text = self.default + ("{0:.%sf}"%(self.decimals)).format(value)