




let optionApiKey={};
optionApiKey.label="Please give the API key:";
optionApiKey.name="optionApiKey"; 
optionApiKey.value="";
addTextinput("inputFields", optionApiKey) 

let optionLeId={};
optionLeId.label="Please give the LE id:";
optionLeId.name="optionLEKey";
optionLeId.value="";
addTextinput("inputFields", optionLeId)

let optionCountryLE={
    label:"Country for Legal Entity",
    name:"optionCountryLE",
    value:"NL", // default value
    values:[
        { value: "NL", description: "Netherlands" },
        { value: "UK", description: "United Kingdom" },
        { value: "US", description: "United States"}
                ],
    onChange : (option, dropdown) => {
        console.log("country for LE changed to:" + option.value);
        for (const apiRequest of apiRequests) {
            handleRegenerate(apiRequest);
            validateJsonBackground(apiRequest.requestDisplay);
        }
    }
};
addDropdown("inputFields", optionCountryLE);


let playAllButton={
    label: "select & play all",
    name: "playAllButton",
    onClick: async (option, button) => {
        console.log("select all & fire all requests");
        for (const apiRequest of apiRequests) {
            apiRequest.checkboxElement.checked = true
        }
        for (const apiRequest of apiRequests) {
            //no if checked because we just checked them all
            let result = await fireRequest(apiRequest);
            if (result.requestOk){
                apiRequest.checkboxElement.checked = false
            }
            console.log(`result of request: `, result);
        }
    }
}
addButton("inputFields", playAllButton);

let selectAllButton={
    label: "select all",
    name: "selectAllButton",
    onClick: () => {
        console.log("select all");
        for (const apiRequest of apiRequests) {
            apiRequest.checkboxElement.checked = true
        }
    }
}
addButton("inputFields", selectAllButton);

let deSelectAllButton={
    label: "deselect all",
    name: "deSelectAllButton",
    onClick: () => {
        console.log("deselect all");
        for (const apiRequest of apiRequests) {
            apiRequest.checkboxElement.checked = false
        }
    }
}
addButton("inputFields", deSelectAllButton);

let playSelectedButton={
    label: "play selected",
    name: "playSelectedButton",
    onClick: async (option, button) => {
        console.log("fire all selected requests");
        for (const apiRequest of apiRequests) {
            if (apiRequest.checkboxElement.checked){
                let result = await fireRequest(apiRequest);
            
                if (result.requestOk){
                    apiRequest.checkboxElement.checked = false;
                }
                console.log(`result of request: `, result);
            }
        }
    }
}
addButton("inputFields", playSelectedButton);