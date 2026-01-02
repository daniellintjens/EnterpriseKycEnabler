 

const fireRequest = async (item) => {
  console.log(`▶ fireing ${item.requestType} request for: ${item.name}`);
  if (item.preExecute && typeof item.preExecute === 'function') {
    try{
      item.preExecute(item)
    } catch (error) {
      console.log(error)
      console.log('preExecute() of '+item.name+' failed; sending unaltered text');
    }
  }
  // Simulate an API call delay
  item.responseDisplay.innerHTML = 'Loading...';
  try {
      const result = await sendData(item.requestType, optionApiKey.value, item.endpointDisplay.innerText, item.requestDisplay.innerText)
      if (result?.requestOk){
        console.log('✅ Request successful!');
      } else {
        console.log('❌ Request failed!');
      }
      console.log('API Response Data:', result);
      var jsonString = JSON.stringify(result.apiResponse, function replacer(key, value) { if (typeof (value) === 'function') { return value.toString(); } return value;}, 2);
      item.responseDisplay.innerText = jsonString;
      return result
  }
  catch (error)  {
      console.error('❌ Request failed in catch block:', error.message);
      item.responseDisplay.textContent = error.message;
      return error.message
  }
};

const handleRegenerate = (item) => {
    console.log(`🔄 Regenerating content for: ${item.name}`);
    // reset the requestDisplay content 
    //TODO: the request should be saved so this function can "reset" it. 
    item.requestDisplay.innerText = item.requestBackupForRegeneration;
    item.endpointDisplay.innerText = item.endpoint;
};
 
 function addTextinput(id, option) {
    const targetDiv = document.getElementById(id);

  let col = document.createElement('div');
  //col.classList.add('col-sm-2');
  col.classList.add('my-1');

  if (option.hasOwnProperty('label')) {
    col.innerText = option.label;
  } else {
    col.innerText = 'Enter a value for ' + option.name;
  }

  const textInput = document.createElement('input');
  col.appendChild(textInput);
  textInput.type = 'text';
  textInput.id = 'option__' + option.name;
  textInput.classList.add('form-control');
  textInput.classList.add('form-control-sm');


  targetDiv.appendChild(col);
  if ('value' in option) {
    textInput.value = option.value;
  }
  // save the value of the checkbox to the cookie on change
  textInput.addEventListener('change', () => {
    option.value= textInput.value;
  });
  if (typeof option.onChange === 'function') {
    textInput.addEventListener('change', () => {
      option.onChange(option, textInput);
    });
    option.onChange(option, textInput);
  }
  option.element = textInput;
}


function addButton(id, option) {

 const targetDiv = document.getElementById(id);
  let button = document.createElement('button');

  if ((option.container) && (!option?.panelOption==true)){
    targetDiv.appendChild(button);
    button.classList.add('mx-1')
  } else {
    let col = document.createElement('div');
    col.classList.add('my-1');
    let dgrid = document.createElement('div')
    dgrid.classList.add('d-grid');
    col.appendChild(dgrid);
    dgrid.appendChild(button);

    // Append the button to the element
    targetDiv.appendChild(col);
    button.classList.add('btn-sm');
  }
  button.classList.add('btn');
  button.classList.add('btn-primary');

  //button.classList.add('btn-block');
  if (option.hasOwnProperty('label')) {
    button.innerText = option.label;
  } else {
    button.innerText = option.name;
  }
  button.id = 'option__' + option.name;
  if (option.labelClass)
  {
    //console.log('addButton: [',option.name,'] has a labelClass');
    //console.log(option);
    button.classList.add('btn-labeled');
    let span = document.createElement('span');
    
    span.classList.add('btn-label');
    let i_element = document.createElement('i');
    
    option.labelClass.split(' ').forEach((lC)=>{
      i_element.classList.add(lC);
    })
    span.appendChild(i_element);
    button.insertBefore(span, button.firstChild);
  }
  if (option.onClick){
  button.addEventListener("click", () => {
    option.onClick(option, button)
  });
  } /*else {
    console.log('addButton: odd, button [',option.name,'] does not have an onClick event handler');
  }*/
  if (typeof option.onChange === 'function') {
    button.addEventListener('change', () => {
      option.onChange(option, button);
    });
    option.onChange(option, button);
  }
  option.element = button;
}

/**
 * Dynamically adds a new item to a Bootstrap 5 Accordion component, 
 * automatically generating the body template for Request/Response content.
 * * @param {string} accordionId - The ID of the parent accordion element (e.g., "accordionExample").
 * @param {Object} option - An object containing the item's details and functions.
 * @param {string} option.name - A unique name for the item, used for element IDs.
 * @param {string} option.heading - The text to display in the accordion item header.
 * @param {function} option.playFunction - The function to execute when the "Play" button is clicked.
 * @param {function} option.regenerateFunction - The function to execute when the "Regenerate" button is clicked.
 * @param {string} [option.request] - Optional initial content for the request display div.
 */

let apiRequests = [];

function addAccordionItem(accordionId, option) {
    const accordion = document.getElementById(accordionId);


    apiRequests.push(option);

    if (!accordion) {
        console.error(`Accordion element with ID "${accordionId}" not found.`);
        return;
    }

    // 1. Generate unique IDs
    const itemCount = accordion.children.length;
    const itemIndex = itemCount + 1;
    const uniqueName = option.name.replace(/\s/g, '_');
    const collapseId = `collapseItem${itemIndex}_${uniqueName}`;
    const headingId = `headingItem${itemIndex}_${uniqueName}`;
    const isFirstItem = itemCount === 0;
    
    const playBtnId = `playBtn_${collapseId}`;
    const regenBtnId = `regenBtn_${collapseId}`;
    
    // Generate unique IDs for the request and response content divs
    const requestId = `${uniqueName}Request`;
    const responseId = `${uniqueName}Response`;
    const endpointId = `${uniqueName}Endpoint`;
    
    // Determine initial content for the request div
    //const initialRequestContent = option.request || '';

    // 2. Generate the dynamic accordion body template
    /*const accordionBodyContent = `
        <div class="p-2 border rounded bg-light mb-3">
            <h6 class="mb-1 text-primary">Request</h6>
            <div id="${requestId}">${initialRequestContent}</div>
        </div>
        <div class="p-2 border rounded bg-light">
            <h6 class="mb-1 text-success">Response</h6>
            <div id="${responseId}">No response yet.</div>
        </div>
    `;*/
    const accordionBodyContent = `
    <div class="p-2 border rounded bg-light mb-3">
        <h6 class="mb-1 text-primary">Endpoint</h6>
        <div id="${endpointId}" contenteditable="true" style="min-height: 30px; border: 1px solid #ccc; padding: 5px; background-color: white;">   
        </div>
    </div>
    <div class="p-2 border rounded bg-light mb-3">
        <h6 class="mb-1 text-primary">Request</h6>
        <div id="${requestId}" contenteditable="true" style="min-height: 50px; border: 1px solid #ccc; padding: 5px; background-color: white;">   
        </div>
    </div>
    <div class="p-2 border rounded bg-light">
        <h6 class="mb-1 text-success">Response</h6>
        <div id="${responseId}">
            No response yet.
        </div>
    </div>
`;
    
    // 3. Header Structure (Same as previous working version)
    const headerWrapperContent = `
        <div class="d-flex align-items-center p-2 w-100">
            <div class="d-flex align-items-center me-3" onclick="event.stopPropagation();">
                <input 
                    class="form-check-input my-0 me-2" 
                    type="checkbox" 
                    name="${option.name}" 
                    id="checkbox_${collapseId}"
                >
                <button 
                    id="${playBtnId}"
                    class="btn btn-sm btn-success py-0 px-2 me-2"  
                    type="button" 
                    title="Play ${option.name}">
                    ▶
                </button>
                <button 
                    id="${regenBtnId}"
                    class="btn btn-sm btn-info py-0 px-2"  
                    type="button" 
                    title="Regenerate ${option.name}">
                    🔄
                </button>
            </div>
            
            <button 
                class="accordion-button flex-grow-1 p-0 bg-transparent shadow-none border-0 ${isFirstItem ? '' : 'collapsed'}" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#${collapseId}" 
                aria-expanded="${isFirstItem ? 'true' : 'false'}" 
                aria-controls="${collapseId}">
                <span class="text-dark text-start">${option.heading}</span>
            </button>
        </div>
    `;

    // 4. Construct the full HTML string for the new accordion item
    const newItemHTML = `
        <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
                ${headerWrapperContent}
            </h2>
            <div 
                id="${collapseId}" 
                class="accordion-collapse collapse ${isFirstItem ? 'show' : ''}" 
                aria-labelledby="${headingId}" 
                data-bs-parent="#${accordionId}">
                <div class="accordion-body">
                    ${accordionBodyContent} </div>
            </div>
        </div>
    `;

    // 5. Insert HTML and assign elements/event listeners
    accordion.insertAdjacentHTML('beforeend', newItemHTML);
    
    // Assign references (must be done AFTER insertion)
    const newCheckbox = accordion.querySelector(`#checkbox_${collapseId}`);
    const requestDiv = accordion.querySelector(`#${requestId}`);
    requestDiv.innerText = option.request;
    const responseDiv = accordion.querySelector(`#${responseId}`);
    const endpointDiv = accordion.querySelector(`#${endpointId}`);
    endpointDiv.innerText = option.endpoint;

    if (newCheckbox) option.checkboxElement = newCheckbox;
    // Store references to the display areas for later updates
    if (requestDiv) option.requestDisplay = requestDiv;
    if (responseDiv) option.responseDisplay = responseDiv;
    if (endpointDiv) option.endpointDisplay = endpointDiv;

    // Add event listeners (assuming functions are defined externally)
    const playButton = accordion.querySelector(`#${playBtnId}`);
    const regenButton = accordion.querySelector(`#${regenBtnId}`);

    if (playButton ) {
        playButton.addEventListener('click', (event) => {
            //event.stopPropagation();
            fireRequest(option);
        });
    }

    if (regenButton ) {
        option.requestBackupForRegeneration = option.request;
        regenButton.addEventListener('click', (event) => {
            //event.stopPropagation();
            handleRegenerate(option); 
        });
    }
}