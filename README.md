# Kaiser Engineering Digital Dash GUI

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FKaiserEngineering%2Fdigitaldash%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/KaiserEngineering/digitaldash/goto?ref=master)

For more information see the [wiki](https://wiki.kaiserengineering.io/en/gui)

## Running Locally

### Install pipenv

```sh
python -m pip install pipenv
```

### Install Nodejs

* TODO Instructions on this

### Install Python and Nodejs packages 

```
make install
```

### If doing development work install Python dev deps and pre-commit

```sh
pipenv install --dev

# mac
brew install pre-commit

# pip
pip install pre-commit

# conda
conda install -c conda-forge pre-commit
```


## Running the DD

```sh
make run
```

## Testing

```bash
make test
make lint
```
