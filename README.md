[![Lint](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/lint.yml)
[![Format](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/format.yml/badge.svg)](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/format.yml)
[![Audit](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/audit.yml/badge.svg)](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/audit.yml)
[![publish](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/releases.yml/badge.svg)](https://github.com/KaiserEngineering/shiftlight-configuration-tool/actions/workflows/releases.yml)

For more information see the [wiki](https://wiki.kaiserengineering.io/en/gui)

## Install Deps

Requires Python3.7

```sh
pip install -r requirements.txt
```

## Running the DD

```sh
make run
```

## Testing

```bash
make test
make lint
cd libdigitaldash
cargo test
```
