# Enterprise Payouts / Bank KYC enabler

## HOWTO run
You can run this tool in codespaces. Create a codespace using "Code"->"Codespaces"-> "+" in the github menu/buttons. This will deploy the tool and automatically start it. Once initiated, wait untill the popup with the browser link shows up on the right bottom corner. Click the browser link and the app will start in a new window.
Alternatively, see the "local installation" steps below to run your own local copy. 

## Description
This project gives you an easy way to remove any blocking KYC for _enterprise payouts_ and _enterprise bank_ accountholders in TEST. It kind of works the same as the [tool found on rooftown]([url](https://www.rooftown.nl/payouts?type=workshop)) https://www.rooftown.nl/payouts?type=workshop. 
This tool will give you a bit more flexibility as you can freely edit the messages before sending, and patch in any changes needed for your specific case. As the source is available and the tool can easely be run locally, patching the tool when there are any bugs, new LEM API changes or missing functionality should be easy. 

## Releases

### 2026-07-13 Added adyenCard TOS 
Added signing of TOS for adyenCard, which is needed for issuing. 

### 2026-04-01 Added liveSelfie and Financial reports
Added a new document upload for live selfies and added financial report to the patch organisation call. 

### 2026-02-24 API key caching
If you're using the tool often (like me) with balance platforms/account holders linked to the same test company account (on PSP) , you will often paste the same API key into the input field. I've implemented key caching for this use case; The API key is stored in the browser local storage and upon loading the tool, the key is retreived. The input box will have a blue background indicating the key was pre-filled from last time's value and returns to white if you edit/past a new value into it.

### 2026-02-19 Now supports codespaces
You can deploy the EnterpriseKycEnabler now in codespaces! Just create a codespace using "Code"->"Codespaces"-> "+". It will auto-setup and auto-run. You only have to wait untill the popup with the browser link shows up on the right bottom corner and the app is ready for use! 

### 2026-02-09 Now supports UK and US entities!
Now comes with full support of UK and US based entities. Use the dropdown to select the country, and the requests will refresh upon selection to the correct version for the selected country. 

## Known issues
### 2nd request sometimes fails
Not sure why this is, but the 2nd request is sometimes "blocked" by the browser and not send to the backend. I've implemented a timeout (of 2 seconds) specifically to handle this issue. The request is not always needed as it patches the country and adress which is not needed when you try to fix a dutch (NL) entity.



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
