# Enterprise Payouts / Bank KYC enabler


## Details


## Requirements

- Python 3.12 or greater
- Python libraries:
  - flask
  - flask_cors
  - python-dotenv
  - requests


## Quick Start with GitHub Codespaces

This repository is configured to work with [GitHub Codespaces](https://github.com/features/codespaces). Click the badge below to launch a Codespace with all dependencies pre-installed.

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/codespaces/new/adyen-examples/adyen-python-online-payments?ref=main&devcontainer_path=.devcontainer%2Fdevcontainer.json)

However, you must create the "log" directory manually in the created codespace.

For detailed setup instructions, see the [GitHub Codespaces Instructions](https://github.com/adyen-examples/.github/blob/main/pages/codespaces-instructions.md).

## Local Installation

1. Clone this repo:

```
git clone https://github.com/daniellintjens/EnterpriseKycEnabler.git
```

2. Run `source ./setup.sh` to:
   - Create and activate a virtual environment
   - Download the necessary python dependencies

3. Create a .env file based on the .env.default file
  - PORT (default 8081)

4. Run `./start.sh` to:
   - Initialize the required environment variables. This step is necessary every time you re-activate your venv
   - Start Python app

5. Visit [http://localhost:8081/](http://localhost:8081/) 



## License

MIT license. For more information, see the **LICENSE** file in the root directory.
