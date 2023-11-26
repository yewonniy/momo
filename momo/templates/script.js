chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateSearch") {
        var searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = request.query;
        }
    }
});
window.onload = function() {
    var targetContainer = document.querySelector('#rcnt');
    if (!targetContainer) return;
}

async function waitForElement(id) {
    while (document.getElementById(id) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return document.getElementById(id);
}
let searchWord;

// Google 검색창이 로드된 후 실행될 함수
async function onGoogleSearchLoad() {
    // 대기 시간 (밀리초) 설정
    const delayTime = 2000; // 예: 2초 대기

    // Google 검색창 로드 후 일정 시간 대기
    await new Promise(resolve => setTimeout(resolve, delayTime));

    // id가 APjFqb인 검색어를 가져와서 저장
    searchWord = document.getElementById('APjFqb').value;

    // 검색어 출력
    console.log('검색어:', searchWord);
    // 여기서 검색어(searchWord) 변수를 활용하여 원하는 작업을 수행할 수 있습니다.
    chrome.storage.local.set({ 'searchWord': searchWord });

            // 변수에 값이 할당된 후에 메시지를 보내야 합니다.
        
    // 여기서 검색어(searchWord) 변수를 활용하여 원하는 작업을 수행할 수 있습니다.

    // iframe 추가
    const iframe = document.createElement('iframe');
    iframe.style.width = '431px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';
    iframe.style.display = 'flex';
    iframe.src = chrome.runtime.getURL('home.html');
    
    // iframe 추가
    const targetContainer = document.querySelector('#rcnt');
    if (targetContainer) {
        targetContainer.style.display = 'flex';
        targetContainer.style.flexDirection = 'row';
        targetContainer.appendChild(iframe);
    }
}
// 페이지가 로드된 후 Google 검색창이 있는지 확인하고, 있다면 onGoogleSearchLoad 함수 실행
function checkForGoogleSearch() {
    const googleSearchInput = document.querySelector('#sfcnt');
    
    if (googleSearchInput) {
        // Google 검색창이 있을 경우
        onGoogleSearchLoad().then(
            chrome.runtime.sendMessage({
                type: 'searchButtonClicked',
            })
        )
    } else {
        // Google 검색창이 없을 경우, 재귀적으로 확인
        setTimeout(checkForGoogleSearch, 100);
    }
}


// 페이지가 로드된 후 Google 검색창 확인
window.addEventListener('load', checkForGoogleSearch);
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        iframe.style.display = 'flex';
        iframe.style.marginLeft = '10px';
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

