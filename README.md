# Enterprise Payouts / Bank KYC enabler


## Details
This project gives you an easy way to remove any blocking KYC for _enterprise payouts_ and _enterprise bank_ accountholders in TEST. It kind of works the same as the [tool found on rooftown]([url](https://www.rooftown.nl/payouts?type=workshop)) https://www.rooftown.nl/payouts?type=workshop. 
This tool will give you a bit more flexibility as you can freely edit the messages before sending, and patch in any changes needed for your specific case. As the source is available and the tool can easely be run locally, patching the tool when there are any bugs, new LEM API changes or missing functionality should be easy. 

## Known issues
### 2nd request sometimes fails
Not sure why this is, but the 2nd request is sometimes "blocked" by the browser and not send to the backend. I've implemented a timeout (of 2 seconds) specifically to handle this issue. The request is not always needed as it patches the country of the legal entity which should already be "NL". This brings us to the 2nd known issue...
### Only country code NL is supported
I've chosen not to implement UK and US KYC enablement in this first release because it was a bit of work, obviously, but also because I'm not really sure we actually need US or UK based accountholders for enterprise payout or enterprise bank setups in TEST. If you send me the requests needed, I'm more than happy to add this functionality (but feel free to add the changes yourself!)

## Requirements

- Python 3.12 or greater
- Python libraries:
  - flask
  - flask_cors
  - python-dotenv
  - requests


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
