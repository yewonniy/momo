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
    fetch(`https://port-0-momo-5mk12alp3wgrdi.sel5.cloudtype.app/?word=${inputWord}`)
        .then(response => response.json())
        .then(data => {
            // Save the result to Chrome local storage
            console.log(data);
            chrome.storage.local.set({ 'searchResult': data }, function () {
                console.log('Data saved to local storage:', data);
            });
            chrome.storage.local.set({ 'searchWordback': '' }, function () {
                console.log('searchWordback cleared');
            });
            window.postMessage({ type: 'datapush' }, '*');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
    // Retrieve searchWordback from local storage
// function checkAndProcessSearchWordback() {
//     chrome.storage.local.get(['searchWordback'], function (result) {

//     searchWordback = result.searchWordback;
//     // Check if searchWordback is not empty before sending the request
//     if (searchWordback !== '') {
//         sendRequestAndSaveToStorage(searchWordback);
//         console.log(searchWordback);
//     } else {
//         setTimeout(checkAndProcessSearchWordback, 100);
//     }
//     });
// }
document.addEventListener('DOMContentLoaded', function() {
    // 여기에 코드를 작성하세요.
    window.addEventListener('message', function(event) {
    if (event.source !== window) return;

    const message = event.data;

    if (message && message.type === 'searchButtonClicked') {
        console.log('메세지 옴');
        const searchWord = message.message;
        console.log(searchWord);
        sendRequestAndSaveToStorage(searchWord);
    }
    });
});
