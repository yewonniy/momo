// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === "getTabUrl") {
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             if (chrome.runtime.lastError) {
//                 console.error("Error in tabs.query: ", chrome.runtime.lastError);
//                 sendResponse({url: null});
//                 return;
//             }

//             if (tabs.length > 0 && tabs[0].url) {
//                 sendResponse({url: tabs[0].url});
//             } else {
//                 sendResponse({url: null}); // Send a response even if no URL is found
//             }
//         });
//         return true; // This is crucial for asynchronous response
//     }
//     // Handle other actions
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.action === "updateSearch") {
//         // Forward the search query to home.html
//         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//             chrome.tabs.sendMessage(tabs[0].id, request);
//         });
//     }
// });

// background.js

let searchWordback ;

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.type === 'searchButtonClicked') {
//         console.log('ㄷ');
//         chrome.storage.local.get(['searchWord'], function (result) {
//             searchWordback = result.searchWord;
//             console.log(searchWordback);

//             var xhr = new XMLHttpRequest();
//             var url = 'https://port-0-momo-5mk12alp3wgrdi.sel5.cloudtype.app/';

//             // Assuming searchWord is a variable containing the data you want to send
//             var params = 'input_word=' + encodeURIComponent(searchWordback);

//             xhr.open('GET', url + '?' + params, true);

//             xhr.onreadystatechange = function () {
//                 if (xhr.readyState == 4) {
//                     // The request is completed
//                     if (xhr.status == 200) {
//                         // Successful response
//                         var res = JSON.parse(xhr.responseText);

//                         // Send a message to the extension
//                         chrome.runtime.sendMessage({
//                             type: 'listmessage',
//                             payload: {
//                                 message: res,
//                             },
//                         });

//                         // Synchronously send the response
//                         sendResponse({ success: true });
//                     } else {
//                         // Error handling
//                         console.error('Error:', xhr.statusText);

//                         // Synchronously send the response
//                         sendResponse({ success: false });
//                     }
//                 }
//             };

//             // Send the request
//             xhr.send();

//             // IMPORTANT: Do not use sendResponse here, it should only be used inside the onMessage listener
//             // sendResponse({ success: true }); // Avoid this
//         });

//         // To indicate that you want to send a response asynchronously, you can return true
//     }
// });
function sendRequestAndSaveToStorage(inputWord) {
    console.log(inputWord);
    // 외부 URL로 데이터를 보냅니다.
    fetch('https://port-0-momo-5mk12alp3wgrdi.sel5.cloudtype.app/?input_word=' + inputWord)
        .then(response => response.json())
        .then(data => {
            // 받은 결과를 Chrome 로컬 스토리지에 저장합니다.
            console.log(data);
            chrome.storage.local.set({ 'searchResult': data }, function () {
                console.log('Data saved to local storage:', data);
            });
            chrome.storage.local.set({ 'searchWordback': '' }, function () {
                console.log('searchWordback cleared');
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

    // Retrieve searchWordback from local storage
function checkAndProcessSearchWordback() {
    chrome.storage.local.get(['searchWordback'], function (result) {

    searchWordback = result.searchWordback;
    // Check if searchWordback is not empty before sending the request
    if (searchWordback !== '') {
        sendRequestAndSaveToStorage(searchWordback);
        console.log(searchWordback);
    } else {
        setTimeout(checkAndProcessSearchWordback, 100);
    }
    });
}

window.addEventListener('load', checkAndProcessSearchWordback);
