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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'searching') {
        searchWord = request.payload.message;
        console.log(searchWord);
        sendResponse({
            message: searchWord,
        });
    } 
    return true; // 비동기로 작업 시 필요
});


