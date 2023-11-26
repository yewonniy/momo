const container = document.getElementsByClassName("results-container")[0];

const trigger_option = localStorage.getItem("trigger_option");
const setting_option = localStorage.getItem("setting_option");
document.getElementById('settings-button').addEventListener('click', goToSettings);

const showingLists = (words, type) => {
  const res = words[0];
  const ul = document.createElement("ul");

  key_list = Object.keys(res);
  for (idx in key_list) {
    const li = document.createElement("li");

    key = key_list[idx];
    pronounciation = res[key][0];
    definitionIndex = res[key].indexOf(':');
    definition = res[key].substring(definitionIndex + 1).trim();

    if (type === "no_pron") {
      li_text = key + " " + `(${pronounciation})` + " : " + definition;
    } else {
      li_text = key + " : " + definition;
    }
    console.log(li_text);
    li.innerHTML = li_text;
    ul.appendChild(li);
  }
  ul.className = "results-list";
  container.appendChild(ul);
};

document.addEventListener('DOMContentLoaded', function () {
  // background.js에서 로컬 스토리지에서 검색 결과를 가져오는 코드를 추가
  chrome.storage.local.get(['searchResult'], function (result) {
      const searchResult = result.searchResult;

      // 검색 결과가 있는지 확인
      if (searchResult) {
          // 검색 결과를 사용하여 페이지를 수정하는 코드
          showingLists(searchResult, setting_option);
      } else {
          console.log('No search result found.');
      }
  });
});

const getMessage = (setting_option) => {
  window.onload = function() {
    chrome.runtime.onMessage.addListener((request) => {
        if (request.type == 'listmessage') {
          const words = request.payload.message;
          showingLists(words, setting_option);
        }
    });
  };
}

if (trigger_option === "passive") {
  const basic_text = document.createElement("p");
  basic_text.innerHTML =
    "영어사운드매치를 사용해보려면 검색 버튼을 클릭하세요.";
  container.append(basic_text);
  
  getMessage(setting_option);
} else {
  console.log("자동");
  // 이하 코드는 여기에 작성
  getMessage(setting_option);
}

function goToSettings() {
    chrome.runtime.sendMessage({action: "getTabUrl"}, function(response) {
        if (chrome.runtime.lastError) {
            console.error("Runtime Error: ", chrome.runtime.lastError);
            return;
        }

        if (response && response.url) {
            var settingsUrl = chrome.runtime.getURL('setting.html') + '?returnUrl=' + encodeURIComponent(response.url);
            window.open(settingsUrl, '_blank');
        } else {
            console.error("Error getting the tab URL or no URL present");
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'searchWord') {
      console.log('메세지 옴')
      const searchInput = document.getElementById('search-input-2');
      if (searchInput) {
          searchInput.value = request.data;
          console.log('변경됨')
          // 변경된 값을 다시 script.js로 메시지 전송
          chrome.runtime.sendMessage({ type: 'inputValueChanged', data: request.data });
      }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  function waitForElements() {
    const searchInput = document.getElementById('search-input-2');
    const searchButton = document.getElementById('search-button-2');

    if (searchInput && searchButton) {
      chrome.storage.local.set({ 'searchWordback': '' }, function () {
          console.log('searchWordback cleared');
      });
      // Both elements are found, proceed with the actions
      chrome.storage.local.get(['searchWord'], function (result) {
        var searchWordback = result.searchWord;
        console.log(searchWordback);
        searchInput.value = searchWordback;

        // Clear searchWordback in local storage
        

        // Set searchWordback in local storage to result.searchWord
        searchButton.addEventListener('click', function () {
            console.log('button clicked');
            searchWordback = searchInput.value;
            console.log(searchWordback);
            chrome.storage.local.set({ 'searchWordback': searchWordback || '' }, function () {
              console.log('searchWordback updated');
            });
          });
        // Add click event listener to the button, setting option에 따라 if문 작성
        if (trigger_option === "passive") {
          searchButton.click();
        }
      });

    } else {
      // One or both elements are not found, wait and try again
      setTimeout(waitForElements, 100); // Adjust the delay time as needed
    }
  }

  // Start waiting for elements
  waitForElements();
});
