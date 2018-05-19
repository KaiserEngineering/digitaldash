"""
Widgets module.

Use this module for writing scripts. This module will load the existing Widgets
and allow them to be altered,
"""
import pandas as pd


class Widgets:
    """
    Widget class.

    Use this Widgets class to Load widgets for scripting!
    Simply use the ARG 'WidgetsInstance' and call the Load
    method!
    """

    def __init__(self):
        """Create Widgets instance."""
        dataframe = pd.DataFrame(columns=['name', 'args'])
        self.df = dataframe
        self.loc = 0

    def Create(self, args, name=None):
        """
        Create new dataframe entry row.

        Inserts our Widget objects into the dataframe,
        which can be loaded by ID or name. Can provide name
        value here to LoadByName in future.

        `instance.Create({'Layout': myLayout, 'gauge': gauge, 'needle': needle }, name='MyDial')`
        Can choose to leave name blank.
        """
        self.df.loc[self.loc] = [name, args]
        self.loc += 1
        return self

    def DataFrame(self):
        """Return the whole Database."""
        return self.df

    def Load(self, ID=None, name=None):
        """
        Load method.

        Loads the row in the DataFrame based on ID
        value. Figure we don't have to worry about the
        ID not being set to an actual value, due to
        if the rows change then the ID values will not
        want to be preserved anyway. Can load by ID value
        or if a name was provideded, can LoadByName.
        """
        if (name):
            return (self.df.loc[self.df['name'] == name])
        return(self.df.loc[[ID]])

    def Size(self):
        """Return the size of the Database."""
        return len(self.df.index)
