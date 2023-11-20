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

async function waitForElementClass(classname) {
    while (document.getElementsByClassName(classname)[0] === null) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return document.getElementsByClassName(classname)[0];
}

const getWord = new Promise((resolve, reject) => {
    const inputElement = document.getElementById('APjFqb');
    var word = inputElement.value;
    return word;
});

async function sendMessage(word) {
    chrome.runtime.sendMessage({
        type: 'googlesearching',
        payload: {
            message: word,
        },
    });
};

window.onload = function() {
    getWord.then(word => {
        const ourInput = waitForElement('search-input-2');
        const ourButton = waitForElement('search-button-2');
        
        if (ourInput) {
            ourInput.value = word;
            ourButton.click();
        }
    }).then(word => sendMessage(word))
    // .then(document.getElementById("search-button-2").addEventListener("click", ()=>{
    //     const searchWord = document.getElementById("search-input-2").value;
    //     console.log(searchWord);
    //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //         const tab = tabs[0];
    //         chrome.scripting.executeScript({
    //             target: { tabId: tab.id },
    //             function: (message) => {
    //                 chrome.runtime.sendMessage(message);
    //             },
    //             args: [{ type: 'wordsearching', payload: { message: searchWord } }],
    //         });
    //     });
    // }))

    // 페이지에 form 요소가 있는지 확인합니다.
    var form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function() {
            let searchQuery = document.querySelector('input[name="q"]').value;
            chrome.runtime.sendMessage({ action: "updateSearch", query: searchQuery });
        });
    }

    var targetContainer;

    var intervalID = setInterval(function() {
        targetContainer = document.querySelector('#rcnt');
        if (targetContainer) {

            clearInterval(intervalID);
            targetContainer.style.display = 'flex';
            targetContainer.style.flexDirection = 'row';
            var iframe = document.createElement('iframe');
            iframe.src = chrome.runtime.getURL('home.html');
            iframe.style.width = '431px';
            iframe.style.height = '400px';
            iframe.style.border = 'none';
            iframe.style.display = 'flex';
            targetContainer.appendChild(iframe);
        }
    }, 1000); // 1초마다 #rcnt 요소를 찾습니다.
}



let searchWord;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == 'wordsearching') {
        console.log(request.payload.message);
        searchWord = request.payload.message;

        // 변수에 값이 할당된 후에 메시지를 보내야 합니다.
        chrome.runtime.sendMessage({
            type: 'searching',
            payload: {
                message: searchWord,
            },
        });
    } 
    sendResponse({});
    return true;
});