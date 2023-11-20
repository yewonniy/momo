console.log("Content script is running");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSearch") {
        var searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = request.query;
        }
    }
});window.onload = function() {
    var targetContainer = document.querySelector('#rcnt');
    if (!targetContainer) return;

    var checkInterval = setInterval(function() {
        var rhsContainer = document.querySelector('#rhs');
        if (rhsContainer) {
            var iframe = createIframe();
            insertIframe(iframe, rhsContainer, true);
            clearInterval(checkInterval);
        } else if (!iframeInDocument()) { // 이 함수로 iframe 존재 여부를 검사
            var iframe = createIframe();
            insertIframe(iframe, targetContainer, false);
        }
    }, 1000);
};

function createIframe() {
    var iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('home.html');
    iframe.style.width = '431px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    return iframe;
}

function insertIframe(iframe, container, isRhsContainer) {
    if (isRhsContainer) {
        iframe.style.position = 'relative';
        iframe.style.zIndex = 3;
        // #rhs 컨테이너의 첫 번째 자식으로 iframe 삽입
        if (container.firstChild) {
            container.insertBefore(iframe, container.firstChild);
        } else {
            container.appendChild(iframe);
        }
    } else {
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        iframe.style.display = 'flex';
        iframe.style.marginleft = '50px';
        container.appendChild(iframe);
    }
}
function iframeInDocument() {
    return document.querySelector('iframe[src="' + chrome.runtime.getURL('home.html') + '"]') != null;
}






document.getElementById("search-button-2").addEventListener("click", ()=>{
    const searchWord = document.getElementById("search-input-2").value;
    console.log(searchWord);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (message) => {
                chrome.runtime.sendMessage(message);
            },
            args: [{ type: 'searching', payload: { message: searchWord } }],
        });
    });
})

// script.js
window.onload = function() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type == 'googlesearching') {
            const inputElement = document.getElementById('search-input-2');
            const buttonElement = document.getElementById('search-button-2');
            console.log(request.payload.message);
            if (inputElement) {
                inputElement.value = request.payload.message;
            }
            if (buttonElement) {
                buttonElement.click();
            }
        }
    });
};

