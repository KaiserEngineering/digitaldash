## Kaiser Engineering Digital Dash GUI

#### Installing:

[![pipeline status](https://gitlab.com/kaiserengineering/DigitalDash_GUI/badges/poetry/pipeline.svg)](https://gitlab.com/kaiserengineering/DigitalDash_GUI/-/commits/master)

##### Install [Poetry](https://python-poetry.org/):

You can also use Curl.

```sh
pip3 install poetry
cd DigitalDash_GUI/
poetry install
```

##### Running the DD:

Use Poetry to run the DD in a development enviroment:

```sh
poetry run dd -d
```

If you are in a production enviroment then you use Python:

```sh
 python3 main.py -d --file tests/data/rpm_increasing.csv -c etc/configs/single.json
```

###### Testing:

Auto CI is enabled for the DD but lets be good about running tests before every push!

```bash
    poetry run pytest
```
