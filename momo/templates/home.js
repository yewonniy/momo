const container = document.getElementsByClassName("results-container")[0];

const trigger_option = localStorage.getItem("trigger_option");
const setting_option = localStorage.getItem("setting_option");
// document.getElementById('settings-button').addEventListener('click', goToSettings);

const showingLists = (words, type) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  const ul = document.createElement("ul");
  for (let i in words) {
    const now_data = words[i];
    const word = now_data["word"];
    const pronun = now_data["pronun"];
    const value = now_data["value"];

    const li = document.createElement("li");
    if (type === "yes_pron") {
      li_text = word + pronun + " : " + value;
    } else {
      li_text = word + " : " + value;
    }
    li.innerHTML = li_text;
    ul.appendChild(li);
  }
  ul.className = "results-list";
  container.appendChild(ul);
};

document.addEventListener("DOMContentLoaded", function () {
  // background.js에서 로컬 스토리지에서 검색 결과를 가져오는 코드를 추가
  window.addEventListener("message", function (event) {
    if (event.source !== window) return;

    const message = event.data;

    if (message && message.type === "datapush") {
      console.log("data 메세지 옴");
      chrome.storage.local.get(["searchResult"], function (result) {
        const searchResult = result.searchResult;

        // 검색 결과가 있는지 확인
        if (searchResult) {
          // 검색 결과를 사용하여 페이지를 수정하는 코드
          showingLists(searchResult, setting_option);
        } else {
          console.log("No search result found.");
        }
      });
    }
  });
});

const getMessage = (setting_option) => {
  window.onload = function () {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type == "listmessage") {
        const words = request.payload.message;
        showingLists(words, setting_option);
      }
    });
  };
};

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
document.addEventListener("DOMContentLoaded", function () {
  // 'settings-button' 요소를 찾아서 클릭 이벤트를 추가합니다.
  const settingsButton = document.getElementById("settings-button");
  settingsButton.addEventListener("click", function () {
    // 버튼이 클릭되면 setting.html로 이동합니다.
    // 현재 페이지 URL에 대한 인코딩을 수행합니다.
    const encodedUrl = encodeURIComponent(window.location.href);

    // 버튼이 클릭되면 새로운 창을 열고 setting.html로 인코딩된 URL을 포함하여 이동합니다.
    window.open(`setting.html?url=${encodedUrl}`, "_blank");
  });
});

// function goToSettings() {
//   window.postMessage({ action: "getTabUrl"}, function(response) {
//     if (chrome.runtime.lastError) {
//         console.error("Runtime Error: ", chrome.runtime.lastError);
//         return;
//     }

//     if (response && response.url) {
//         var settingsUrl = chrome.runtime.getURL('setting.html') + '?returnUrl=' + encodeURIComponent(response.url);
//         window.open(settingsUrl, '_blank');
//     } else {
//         console.error("Error getting the tab URL or no URL present");
//     }}, '*');
// chrome.runtime.sendMessage({}, function(response) {
//     if (chrome.runtime.lastError) {
//         console.error("Runtime Error: ", chrome.runtime.lastError);
//         return;
//     }

//     if (response && response.url) {
//         var settingsUrl = chrome.runtime.getURL('setting.html') + '?returnUrl=' + encodeURIComponent(response.url);
//         window.open(settingsUrl, '_blank');
//     } else {
//         console.error("Error getting the tab URL or no URL present");
//     }
// });
// }
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "searchWord") {
    console.log("메세지 옴");
    const searchInput = document.getElementById("search-input-2");
    if (searchInput) {
      searchInput.value = request.data;
      console.log("변경됨");
      // 변경된 값을 다시 script.js로 메시지 전송
      chrome.runtime.sendMessage({
        type: "inputValueChanged",
        data: request.data,
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  function waitForElements() {
    const searchInput = document.getElementById("search-input-2");
    const searchButton = document.getElementById("search-button-2");

    if (searchInput && searchButton) {
      chrome.storage.local.set({ searchWordback: "" }, function () {
        console.log("searchWordback cleared");
      });
      // Both elements are found, proceed with the actions
      chrome.storage.local.get(["searchWord"], function (result) {
        var searchWordback = result.searchWord;
        console.log(searchWordback);
        searchInput.value = searchWordback;

        // Clear searchWordback in local storage

        // Set searchWordback in local storage to result.searchWord
        searchButton.addEventListener("click", function () {
          console.log("button clicked");
          searchWordback = document.getElementById("search-input-2").value;
          console.log(searchWordback);
          window.postMessage(
            { type: "searchButtonClicked", message: searchWordback },
            "*"
          );
          chrome.storage.local.set(
            { searchWordback: searchWordback || "" },
            function () {
              console.log("searchWordback updated");
            }
          );
        });
        //Add click event listener to the button, setting option에 따라 if문 작성
        if (trigger_option === "active") {
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
