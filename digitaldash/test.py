"""Test harness for GUI that runs on file data."""
# pylint: disable=import-outside-toplevel
# pylint: disable=unused-argument
import csv


class Test:
    """Test instance."""

    app: any

    def __init__(self, **args):
        """Test method"""
        self.iteration = 0
        self.data = []

        if args.get("file"):
            self.loadCSV(**args)
        self.rows = len(self.data)

        if self.data:
            array = self.data[0]
            self.cols = len(array)

    def setData(self, data):
        """Set testing data source."""
        self.data = data
        if self.data:
            array = self.data[0]
            self.cols = len(array)

    def loadCSV(self, file):
        """
        Load data from file.
            :param self: <DigitalDash.Test>Test instance
            :param file: <String>File path
        """
        with open(file, "r") as csvfile:
            datareader = csv.reader(csvfile, delimiter=",", quotechar="|")
            for row in datareader:
                self.data.append(row)
        if self.data:
            array = self.data[0]
            self.cols = len(array)

    def service(self, pids=None, app=None):
        """
        Main service method for test data.
            :param self: <DigitalDash.Test>Test instance
        """
        data = self.data[self.iteration]

        keyVal = {}
        i = 0
        for pid in pids:
            if self.cols >= i:
                i = 0
            keyVal[pid.value] = data[i]
            i = i + 1
        self.enumerate()
        return keyVal

    def enumerate(self):
        """
        Iterate over test data.
            :param self: <DigitalDash.Test>Test instance
        """
        self.iteration += 1
        if self.iteration >= self.rows:
            self.iteration = 0
        # Skip headers
        if self.iteration == 0:
            self.iteration = 1

        return self.iteration

    @staticmethod
    def updateRequirements(app, pidByteCode, pids):
        """Test method"""
        print(f"Test: Updating requirements: {pidByteCode}")
        app.pids = pids
        return (1, "PIDs updated")

    def new(self, config=None, data=None, csvFile=None):
        """Test method"""
        from main import GUI

        if csvFile:
            self.loadCSV(csvFile)
        elif data:
            self.setData(data)

        self.app = GUI()
        self.app.new(configFile=config, data=self)
        self.app.run()

    def initialize_hardware(self):
        """Test initialize_hardware method"""
        return (True, "Hardware: Successfully initiated hardware")
