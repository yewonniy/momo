// background.js

let searchWordback;

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'searchButtonClicked') {
        chrome.storage.local.get(['searchWord'], function (result) {
            searchWordback = result.searchWord;
            console.log(searchWordback);

            // Send the request and handle the response
            sendRequestAndSaveToStorage(searchWordback);
            someAsyncFunction().then(result => {
                sendResponse(result);
            });
            return true;
        });
        return true; // Indicate async response
    }
    // Handle other message types...
});

function sendRequestAndSaveToStorage(inputWord) {
    console.log(inputWord);
    // Send data to an external URL
    fetch('https://port-0-momo-5mk12alp3wgrdi.sel5.cloudtype.app/?input_word=' + inputWord)
        .then(response => response.json())
        .then(data => {
            // Save the result to Chrome local storage
            console.log(data);
            chrome.storage.local.set({ 'searchResult': data }, function () {
                console.log('Data saved to local storage:', data);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// No need for DOMContentLoaded event listener in background script
