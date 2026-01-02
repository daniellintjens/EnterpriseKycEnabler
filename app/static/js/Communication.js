 
 const PROXY_POST_URL = JSON.parse(document.getElementById('PROXY_POST_URL').innerHTML);
 const PROXY_PATCH_URL = JSON.parse(document.getElementById('PROXY_PATCH_URL').innerHTML);
 const PROXY_GET_URL = JSON.parse(document.getElementById('PROXY_GET_URL').innerHTML);



/**
 * Executes an asynchronous POST request to a specified endpoint.
 *
 * @param {string} apiKey - The API key to be sent in the 'X-API-KEY' header.
 * @param {string} endpoint - The full URL of the API endpoint.
 * @param {Object} message - The JSON object to be sent as the request body.
 * @returns {Promise<Object>} A promise that resolves to an object containing the API response and the return message.
 * @throws {Error} Throws an error if the request fails or the response status is not OK (200-299).
 */

const sendData = async (sendMethod, apiKey, endpoint, message) => {
  const controller = new AbortController();
  const { signal } = controller;

  // 2. Start a timer to abort the request after 2000ms
  const timeoutId = setTimeout(() => {
      controller.abort();
      console.log("2 seconds passed: Aborting request...");
  }, 2000);

  const proxyMap = {
    'POST': PROXY_POST_URL,
    'PATCH': PROXY_PATCH_URL,
    'GET': PROXY_GET_URL
  };

  const proxy_url = proxyMap[sendMethod];
  if (!proxy_url) throw new Error(`Unsupported method: ${sendMethod}`);

  const fetchObject = {
    method: sendMethod,
    signal: signal, // Attach the timeout signal
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      'X-Target-URL': endpoint,
    }
  };

  // Only GET and HEAD cannot have a body, head is not supported/used so:
  if (sendMethod !== 'GET') {
    fetchObject.body = message;
  }

  try {
    const response = await fetch(proxy_url, fetchObject);

    const responseText = await response.text();
    try {
        return {
            requestOk: response.ok,
            apiResponse: responseText ? JSON.parse(responseText) : {}
        };
    } catch (e) {
        console.warn('Response not JSON, returning raw text.');
        return { 
          requestOk: false,
          apiResponse: { raw: responseText } 
        };
    }
  } catch (error) {
    console.error(`${sendMethod} request failed:`, error.message);
    console.error(error)
    throw error;
  } finally {
        clearTimeout(timeoutId);
  }
};