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
    // Setup iframe properties with CSS variables
    iframe.style.flex = '0 auto';
    iframe.style.position = 'relative';
    iframe.style.transition = 'opacity 0.3s';
    iframe.style.width = '23rem';
    iframe.style.border = 'none'; // 이 부분을 추가
    // Set the source of the iframe
    iframe.src = chrome.runtime.getURL('home.html');

    window.addEventListener('message', function(event) {
        // Optional: Check the origin here for security
        if (event.data.iframeHeight) {
            iframe.style.height = (event.data.iframeHeight + 50) + 'px'; // Add 10px to the content height
        }
    });

    // Append the iframe to the appropriate container
    const rhsContainer = document.querySelector('#rhs');
    if (rhsContainer) {
        iframe.style.marginBottom = '40px'; // Corrected property name
        rhsContainer.insertBefore(iframe, rhsContainer.firstChild);
    } else {
        const rcntContainer = document.querySelector('#rcnt');
        if (rcntContainer) {
            iframe.style.marginLeft = '76px';
            rcntContainer.appendChild(iframe);
        }
    }
}

function checkForGoogleSearch() {
    const googleSearchInput = document.querySelector('#sfcnt');
    
    if (googleSearchInput) {
        onGoogleSearchLoad();
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

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.type == 'googlesearching') {
//         const inputElement = document.getElementById('search-input-2');
//         const buttonElement = document.getElementById('search-button-2');
//         if (inputElement) {
//             inputElement.value = request.payload.message;
//         }
//         if (buttonElement) {
//             buttonElement.click();
//         }
//     }
// });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'searchButtonClicked') {
        console.log('메세지 옴');
        searchWord = request.payload.message
        console.log(searchWord);
    }
  });