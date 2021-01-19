"""Wrapper around kivy.uix.label"""
from typing import NoReturn, TypeVar
from kivy.uix.label import Label
from static.constants import KE_PID
from static.constants import PID_UNIT_LABEL
from kivy.logger import Logger

KL = TypeVar('KL', bound='KELabel')
class KELabel(Label):
    """
    Simple wrapper around Kivy.uix.label.
    """

    def __init__(self, **args):
        """
        Args:
          default (str)     : The text that should always be displayed ie "Max: <num>"
            (default is nothing)
          color (tuple)     : RGBA values for text color
            (default is white (1, 1, 1, 1))
          font_size (int)   : Font size of label
            (default is 25)
          decimals (int)    : Number of decimal places displayed if receiving data
            (default is 2)
          pid (str)         : Byte code value of PID to get data from
            (default is nothing)
        """
        super(KELabel, self).__init__()
        self.min_observed     = 9999
        self.max_observed     = -9999
        self.default          = args.get('default', '')
        self.config_color     = args.get('color', (1, 1, 1, 1)) # White
        self.color            = self.config_color
        self.config_font_size = args.get('font_size', 25)
        self.font_size        = self.config_font_size
        self.decimals         = str(KE_PID.get(args.get('pid', ''), {}).get('decimals', 2))
        self.unit_string      = PID_UNIT_LABEL.get(args.get('unit', ''), '')
        self.object_type      = 'Label'
        self.pid              = args.get('pid', None)
        self.markup           = True

        if self.default == '__PID__':
            if args['pid'] in KE_PID:
                self.default = str(KE_PID[self.pid]['shortName'])
            else:
                self.default = KE_PID[self.pid]['name']
                Logger.error("Could not load shortName from Static.Constants for PID: %s : %s", self.pid, str(e))
        if 'data' in args and args['data']:
            self.text = self.default +' 0'
        else:
            self.text = self.default

        self.set_pos(**args)

    def set_pos(self: KL, **args):
        """This allows the position code to be overwritten, we use this
        for alerts."""
        pos_hints = args.get('pos', (0, 0))

        if args.get('gauge'):
            self.pos = (args.get('x_position') + pos_hints[0], self.pos[1] + pos_hints[1])
        else:
            self.pos_hint = {'x':pos_hints[0] / 100, 'y':pos_hints[1] / 100}

    def set_data(self: KL, value='') -> NoReturn:
        """
        Send data to Label widget.

        Check for Min/Max key words to cache values with regex checks.

        Args:
            self (<lib.ke_label>): KELabel object
            value (float) : value that label is being updated to
        """
        value = float(value)

        if self.default == 'Min: ':
            if self.min_observed > value:
                self.min_observed = value
                self.text = ("{0:.%sf}"%(self.decimals)).format(value)
        elif self.default == 'Max: ':
            if self.max_observed < value:
                self.max_observed = value
                self.text = ("{0:.%sf}"%(self.decimals)).format(value)
        else:
            self.text = self.default + ("{0:.%sf}"%(self.decimals)).format(value)+'[size=15]'+ ' ' + self.unit_string+'[/size]'
