



// --- 2. Create Option Objects ---

let getLegalEntity = {
    name: "getLegalEntity", // Used to create IDs: LegalEntityCheckRequest, LegalEntityCheckResponse
    heading: "GET /lem/v4/legalEntities",
    requestType: "GET",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}",
    request: "",
    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", getLegalEntity);


let patchCountryToNlApiCall = {
    name: "patchCountryToNlApiCall",
    heading: "PATCH /lem/v4/legalEntities - change country to nl",
    requestType: "PATCH",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}",
    request: JSON.stringify(
        {
            "organization": {
                "registeredAddress": {
                    "country": "NL",
                },
                "principalPlaceOfBusiness": {
                    "country": "NL"
                }
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),

    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", patchCountryToNlApiCall);


let patchOrganizationApiCall = {
    name: "patchOrganizationApiCall",
    heading: "PATCH /lem/v4/legalEntities - Add organization details",
    requestType: "PATCH",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}",
    request: JSON.stringify(
        {
            "organization": {
                "registrationNumber": "34179503",
                "vatNumber": "NL123456789B01",
                "taxReportingClassification": {
                    "businessType": "other",
                    "mainSourceOfIncome": "businessOperation",
                    "type": "nonFinancialActive"
                },
                "taxInformation": [
                    {
                        "country": "NL",
                        "number": "811786523",
                        "type": "RSIN"
                    }
                ],
                "registeredAddress": {
                    "city": "Amsterdam",
                    "country": "NL",
                    "postalCode": "1010CG",
                    "stateOrProvince": "NH",
                    "street": "Rokin 49",
                    "street2": "Rokin 21"
                }
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),

    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", patchOrganizationApiCall);


let postCreateIndividualLEApiCall = {
    name: "postCreateIndividualLEApiCall",
    heading: "POST /lem/v4/legalEntities - create individual LE",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities",
    request: JSON.stringify(
        {
            "type": "individual",
            "individual": {
                "residentialAddress": {
                    "city": "Amsterdam",
                    "country": "NL",
                    "postalCode": "1011DJ",
                    "street": "Simon Carmiggeltstraat 6 - 50"
                },
                "phone": {
                    "number": "+14153671502",
                    "type": "mobile"
                },
                "name": {
                    "firstName": "Shelly",
                    "lastName": "Eller"
                },
                "birthData": {
                    "dateOfBirth": "1990-06-21"
                },
                "identificationData": {
                    "number": "1234",
                    "type": "nationalIdNumber"
                },
                "email": "s.eller@example.com",
                "taxInformation": [
                    {
                        "country": "NL",
                        "number": "174559434",
                        "type": "BSN"
                    }
                ]
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2)
};
addAccordionItem("KycRequests", postCreateIndividualLEApiCall);


let patchAssociateIndividualApiCall = {
    name: "patchAssociateIndividualApiCall",
    heading: "PATCH /lem/v4/legalEntities - Add entity associations",
    requestType: "PATCH",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}",
    request: JSON.stringify(
        {
            "entityAssociations": [
                {
                    "jobTitle": "CEO",
                    "legalEntityId": "{{individualLegalEntityId}}",
                    "type": "uboThroughControl"
                },
                {
                    "legalEntityId": "{{individualLegalEntityId}}",
                    "type": "uboThroughOwnership"
                },
                {
                    "jobTitle": "Country Manager",
                    "legalEntityId": "{{individualLegalEntityId}}",
                    "type": "signatory"
                }
            ]
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the previous postCreateIndividualLEApiCall and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
        if (postCreateIndividualLEApiCall && postCreateIndividualLEApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateIndividualLEApiCall.responseDisplay.innerText).id
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{individualLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", patchAssociateIndividualApiCall);


let postCreateTransferInstrumentApiCall = {
    name: "postCreateTransferInstrumentApiCall",
    heading: "POST /lem/v4/transferInstruments - Create transfer instrument",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/transferInstruments",
    request: JSON.stringify(
        {
            "legalEntityId": "{{businessLegalEntityId}}",
            "type": "bankAccount",
            "bankAccount": {
                "accountIdentification": {
                    "type": "iban",
                    "iban": "NL62ABNA0000000123"
                }
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postCreateTransferInstrumentApiCall);


let postCreateBusinessLineBankingApiCall = {
    name: "postCreateBusinessLineBankingApiCall",
    heading: "POST /lem/v4/businessLines - Create businessLine Banking",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/businessLines",
    request: JSON.stringify(
        {
            "service": "banking",
            "industryCode": "4531",
            "webData": [
                {
                    "webAddress": "https://www.adyen.com"
                }
            ],
            "legalEntityId": "{{businessLegalEntityId}}",
            "sourceOfFunds": {
                "type": "business",
                "amount": {
                    "currency": "EUR",
                    "value": 600000
                },
                "adyenProcessedFunds": false,
                "description": "Funds from my flower shop business"
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);

        }
    }
};
addAccordionItem("KycRequests", postCreateBusinessLineBankingApiCall);


let postCreateBusinessLinePaymentProcessingApiCall = {
    name: "postCreateBusinessLinePaymentProcessingApiCall",
    heading: "POST /lem/v4/businessLines - Create businessLine Payment Processing",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/businessLines",
    request: JSON.stringify(
        {
            "service": "paymentProcessing",
            "industryCode": "339E",
            "salesChannels": [
                "eCommerce",
                "ecomMoto"
            ],
            "legalEntityId": "{{businessLegalEntityId}}",
            "webData": [
                {
                    "webAddress": "https://yoururl.com"
                }
            ]
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postCreateBusinessLinePaymentProcessingApiCall);


let postUploadBusinessRegistrationDocApiCall = {
    name: "postUploadBusinessRegistrationDocApiCall",
    heading: "POST /lem/v4/documents - Upload business registration document",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/documents",
    request: JSON.stringify(
        {
            "type": "registrationDocument",
            "attachments": [
                {
                    "content": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBv+f/ub0j6JPRX+E3EmC=="
                }
            ],
            "description": "Registration doc for Example Company",
            "owner": {
                "id": "{{businessLegalEntityId}}",
                "type": "legalEntity"
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the request
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postUploadBusinessRegistrationDocApiCall);


let postUploadBankStatementApiCall = {
    name: "postUploadBankStatementApiCall",
    heading: "POST /lem/v4/documents - Upload bank statement",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/documents",
    request: JSON.stringify(
        {
            "type": "bankStatement",
            "attachments": [
                {
                    "content": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBv+f/ub0j6JPRX+E3EmC=="
                }
            ],
            "description": "Bankstatement description",
            "owner": {
                "id": "{{transferInstrumentId}}",
                "type": "bankAccount"
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the T from the previous postCreateIndividualLEApiCall and patch that into the request
        if (postCreateTransferInstrumentApiCall && postCreateTransferInstrumentApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateTransferInstrumentApiCall.responseDisplay.innerText).id
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{transferInstrumentId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postUploadBankStatementApiCall);


let postUploadPassportDocApiCall = {
    name: "postUploadPassportDocApiCall",
    heading: "POST /lem/v4/documents - Upload passport picture",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/documents",
    request: JSON.stringify(
        {
            "type": "passport",
            "attachments": [
                {
                    "content": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBv+f/ub0j6JPRX+E3EmC=="
                }
            ],
            "description": "Passport description",
            "owner": {
                "id": "{{individualLegalEntityId}}",
                "type": "legalEntity"
            }
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the previous postCreateIndividualLEApiCall and patch that into the request
        if (postCreateIndividualLEApiCall && postCreateIndividualLEApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateIndividualLEApiCall.responseDisplay.innerText).id
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{individualLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postUploadPassportDocApiCall);


let postGenerateTosDocAfpaApiCall = {
    name: "postGenerateTosDocAfpaApiCall",
    heading: "POST /lem/v4/legalEntities/{id}/termsOfService - Create TOS document (adyenForPlatformsAdvanced)",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}/termsOfService",
    request: JSON.stringify(
        {
            "type": "adyenForPlatformsAdvanced",
            "language": "en"
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the endpoint
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
        if (postCreateIndividualLEApiCall && postCreateIndividualLEApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateIndividualLEApiCall.responseDisplay.innerText).id;
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{individualLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postGenerateTosDocAfpaApiCall);


let patchTosDocAfpaApiCall = {
    name: "patchTosDocAfpaApiCall",
    heading: "PATCH /lem/v4/legalEntities/{id}/termsOfService/{id} - Accept TOS (adyenForPlatformsAdvanced)",
    requestType: "PATCH",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}/termsOfService/{{termsofservicedocumentid}}",
    request: JSON.stringify(
        {
            "acceptedBy": "{{individualLegalEntityId}}"
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),

    preExecute: (item) => { // get the LE from the input fields and patch that into the endpoint
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
        if (postGenerateTosDocAfpaApiCall && postGenerateTosDocAfpaApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postGenerateTosDocAfpaApiCall.responseDisplay.innerText).termsOfServiceDocumentId;
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{termsofservicedocumentid}}", 'g'), replacementValue);
        }
        if (postCreateIndividualLEApiCall && postCreateIndividualLEApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateIndividualLEApiCall.responseDisplay.innerText).id
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{individualLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", patchTosDocAfpaApiCall);



let postGenerateTosDocAaApiCall = {
    name: "postGenerateTosDocAaApiCall",
    heading: "POST /lem/v4/legalEntities/{id}/termsOfService - Create TOS document (adyenAccount)",
    requestType: "POST",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}/termsOfService",
    request: JSON.stringify(
        {
            "type": "adyenAccount",
            "language": "en"
        }, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),
    preExecute: (item) => { // get the LE from the input fields and patch that into the endpoint
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
    }
};
addAccordionItem("KycRequests", postGenerateTosDocAaApiCall);


let patchTosDocAaApiCall = {
    name: "patchTosDocAaApiCall",
    heading: "PATCH /lem/v4/legalEntities/{id}/termsOfService/{id} - Accept TOS (adyenAccount)",
    requestType: "PATCH",
    endpoint: "https://kyc-test.adyen.com/lem/v4/legalEntities/{{businessLegalEntityId}}/termsOfService/{{termsofservicedocumentid}}",
    request: JSON.stringify(
        {
            "acceptedBy": "{{individualLegalEntityId}}"
        },
        function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value; }, 2),

    preExecute: (item) => { // get the LE from the input fields and patch that into the endpoint
        if (optionLeId.value) {
            let replacementValue = optionLeId.value.trim();
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{businessLegalEntityId}}", 'g'), replacementValue);
        }
        if (postGenerateTosDocAaApiCall && postGenerateTosDocAaApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postGenerateTosDocAaApiCall.responseDisplay.innerText).termsOfServiceDocumentId;
            item.endpointDisplay.innerText = item.endpointDisplay.innerText.replace(new RegExp("{{termsofservicedocumentid}}", 'g'), replacementValue);
        }
        if (postCreateIndividualLEApiCall && postCreateIndividualLEApiCall?.responseDisplay?.innerText.trim() != "No response yet.") {
            let replacementValue = JSON.parse(postCreateIndividualLEApiCall.responseDisplay.innerText).id
            item.requestDisplay.innerText = item.requestDisplay.innerText.replace(new RegExp("{{individualLegalEntityId}}", 'g'), replacementValue);

        }
    }
};
addAccordionItem("KycRequests", patchTosDocAaApiCall);
