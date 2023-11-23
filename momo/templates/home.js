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
    definition = res[key][1];

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
// document.getElementById("search-button-2").addEventListener("click", ()=>{
//   console.log('좀');
//   const searchWord = document.getElementById("search-input-2").value;
//   console.log(searchWord);
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const tab = tabs[0];
//       chrome.scripting.executeScript({
//           target: { tabId: tab.id },
//           function: (message) => {
//               chrome.runtime.sendMessage(message);
//           },
//           args: [{ type: 'wordsearching', payload: { message: searchWord } }],
//       });
//   });
// })


// // script.js
// window.onload = function() {
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       if (request.type == 'googlesearching') {
//           const inputElement = document.getElementById('search-input-2');
//           const buttonElement = document.getElementById('search-button-2');
//           console.log(request.payload.message);
//           if (inputElement) {
//               inputElement.value = request.payload.message;
//           }
//           if (buttonElement) {
//               buttonElement.click();
//           }
//       }
//   });
// };

document.addEventListener('DOMContentLoaded', function () {
  // Retrieve searchWord from local storage
  chrome.storage.local.get(['searchWord'], function (result) {
    function waitForElements() {
      const searchInput = document.getElementById('search-input-2');
      const searchButton = document.getElementById('search-button-2');

      if (searchInput && searchButton) {
          // Both elements are found, proceed with the actions
          searchInput.value = result.searchWord || '';

          // Add click event listener to the button
          searchButton.addEventListener('click', function () {
              console.log('button clicked');

              chrome.runtime.sendMessage({
                  type: 'searchButtonClicked',
          
              });
          });

          // Trigger the click event programmatically
          searchButton.click();
      } else {
          // One or both elements are not found, wait and try again
          setTimeout(waitForElements, 100); // Adjust the delay time as needed
      }
  }

  // Start waiting for elements
  waitForElements();
  });
  
  // Perform any other actions with searchWord if needed
});