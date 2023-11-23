chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getTabUrl") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (chrome.runtime.lastError) {
                console.error("Error in tabs.query: ", chrome.runtime.lastError);
                sendResponse({url: null});
                return;
            }

            if (tabs.length > 0 && tabs[0].url) {
                sendResponse({url: tabs[0].url});
            } else {
                sendResponse({url: null}); // Send a response even if no URL is found
            }
        });
        return true; // This is crucial for asynchronous response
    }
    // Handle other actions
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSearch") {
        // Forward the search query to home.html
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, request);
        });
    }
});

// background.js

let searchWord; // 변수를 미리 선언해주세요.


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'searchButtonClicked') {
        console.log('ㄷ');
        chrome.storage.local.get(['searchWord'], function (result) {
            searchWord = result.searchWord;
            console.log(searchWord);

            var xhr = new XMLHttpRequest();
            var url = 'https://port-0-momo-5mk12alp3wgrdi.sel5.cloudtype.app/';

            // Assuming searchWord is a variable containing the data you want to send
            var params = 'input_word=' + encodeURIComponent(searchWord);

            xhr.open('GET', url + '?' + params, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    // The request is completed
                    if (xhr.status == 200) {
                        // Successful response
                        var res = JSON.parse(xhr.responseText);

                        // Send a message to the extension
                        chrome.runtime.sendMessage({
                            type: 'listmessage',
                            payload: {
                                message: res,
                            },
                        });

                        // Synchronously send the response
                        sendResponse({ success: true });
                    } else {
                        // Error handling
                        console.error('Error:', xhr.statusText);

                        // Synchronously send the response
                        sendResponse({ success: false });
                    }
                }
            };

            // Send the request
            xhr.send();

            // IMPORTANT: Do not use sendResponse here, it should only be used inside the onMessage listener
            // sendResponse({ success: true }); // Avoid this
        });

        // To indicate that you want to send a response asynchronously, you can return true
        return true;
    }
});