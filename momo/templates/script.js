chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSearch") {
        var searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = request.query;
        }
    }
});

async function waitForElement(id) {
    while (document.getElementById(id) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return document.getElementById(id);
}

let searchWord;

async function onGoogleSearchLoad() {
    const delayTime = 2000;
    await new Promise(resolve => setTimeout(resolve, delayTime));
    searchWord = document.getElementById('APjFqb').value;
    console.log('검색어:', searchWord);
    chrome.storage.local.set({ 'searchWord': searchWord });

    const iframe = document.createElement('iframe');
    setupIframe(iframe);
}

function setupIframe(iframe) {
    iframe.style.width = '431px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.display = 'flex';
    iframe.src = chrome.runtime.getURL('home.html');

    const targetContainer = document.querySelector('#rcnt');
    if (targetContainer) {
        targetContainer.style.display = 'flex';
        targetContainer.style.flexDirection = 'row';
        targetContainer.appendChild(iframe);
    }
}

function checkForGoogleSearch() {
    const googleSearchInput = document.querySelector('#sfcnt');
    
    if (googleSearchInput) {
        onGoogleSearchLoad().then(() => {
            chrome.runtime.sendMessage({ type: 'searchButtonClicked' });
        });
    } else {
        setTimeout(checkForGoogleSearch, 100);
    }
}

window.addEventListener('load', checkForGoogleSearch);

document.getElementById("search-button-2").addEventListener("click", () => {
    const searchWord = document.getElementById("search-input-2").value;
    console.log(searchWord);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: message => {
                chrome.runtime.sendMessage(message);
            },
            args: [{ type: 'searching', payload: { message: searchWord } }],
        });
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'googlesearching') {
        const inputElement = document.getElementById('search-input-2');
        const buttonElement = document.getElementById('search-button-2');
        if (inputElement) {
            inputElement.value = request.payload.message;
        }
        if (buttonElement) {
            buttonElement.click();
        }
    }
});
