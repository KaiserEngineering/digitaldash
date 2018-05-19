![alt text](static/imgs/logo1.png "KE Logo")
# KaiserEngineering DigitalDash GUI Docs
## Running the app
    pyyhon3.6 sbin/run.py 
## Testing
    $ nosetest -s test/my_test.py
    $ nosetests --with-coverage --cover-package=myPackage test/my_test.py
    $ telenium
> [Telenium][telenium] is a web UI for testing the app while it runs, it is convenient for walking through the tree.

## API
[Kaiser Engineering web Docs](docs)
### New Widgets

### DigitalDash DataFrame
#####Create a new entry into DataFrame:
```python
WidgetsInstance.Create({
    'layout': DialLayout,
    'gauge': gauge,
    'labels': labels
```

### The main run loop
This is the loop in *run.py* that creates the Kivy App and loop. The important part about this loop, is it where we need to call updates to the app.

##### Collections that can be accessed  during runtime
```python
    views
    containers
    callbacks
    app,
    background
    alerts
    ObjectsToUpdate
    WidgetsInstance
    bytecode
```

## Widget methods

####setData():
Method will be called for any *LiveWidgets*, the data can be handled on a widget by widget case.

##### Example 
    def setData(self, value):
        self.text = str(value)


####build():
This is a required method in any wiget being added to DigitalDash, it should return a *RelativeLayout* containing all the components for the widget. It should also Load these widgets into the DataFrame, to be accessed later on.

###### ARGS For Build
```python
    liveWidgets = []
    path = ARGS['args']['path']
    container = ARGS['container']
    WidgetsInstance = ARGS['WidgetsInstance']
    DialLayout = RelativeLayout()

    themeConfig = Config.getThemeConfig(ARGS['args']['args']['themeConfig'])
```

##### LiveWidgets
Array containing any widgets that have the *setData()* method and want to be updated.


### Components
Components are an easy way to abstract re-usable parts of a widget!
##### Current components
    Gauge
    Needle
    EllipseSlider
    LinearSlider
    KELabel

[kesite]: [http://kaiserengineering.io]
[docs]:[http://kaiserengineering.io/Docs]
[telenium]:[https://github.com/tito/telenium]