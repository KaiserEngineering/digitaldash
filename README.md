# Kaiser Engineering Digital Dash GUI

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2FKaiserEngineering%2Fdigitaldash%2Fbadge%3Fref%3Dmaster&style=flat)](https://actions-badge.atrox.dev/KaiserEngineering/digitaldash/goto?ref=master)

For more information see the [wiki](https://wiki.kaiserengineering.io/en/gui)

## Install Deps

Requires Python3.7

```sh
pip3 install -r requirements.txt
```

## Running the DD

```sh
python3 main.py -d --file tests/data/rpm_increasing.csv -c etc/configs/single.json
```

## Testing

```bash
python3 -m pytest tests

cd libdigitaldash
cargo test
```
