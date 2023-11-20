console.log("Content script is running");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSearch") {
        var searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = request.query;
        }
    }
});

window.onload = function() {
    console.log("된다");

    // 페이지에 form 요소가 있는지 확인합니다.
    var form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function() {
            let searchQuery = document.querySelector('input[name="q"]').value;
            chrome.runtime.sendMessage({ action: "updateSearch", query: searchQuery });
        });
    }

    console.log("진짜 된다");

    var targetContainer;

    var intervalID = setInterval(function() {
        targetContainer = document.querySelector('#rcnt');
        if (targetContainer) {

            clearInterval(intervalID);
            targetContainer.style.display = 'flex';
            targetContainer.style.flexDirection = 'row';
            console.log("진짜 진짜 된다");
            var iframe = document.createElement('iframe');
            iframe.src = chrome.runtime.getURL('home.html');
            iframe.style.width = '431px';
            iframe.style.height = '400px';
            iframe.style.border = 'none';
            iframe.style.display = 'flex';
            console.log("진짜 진짜 2된다");
            targetContainer.appendChild(iframe);
        }
    }, 1000); // 1초마다 #rcnt 요소를 찾습니다.
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

