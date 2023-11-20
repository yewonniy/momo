const container = document.getElementsByClassName("results-container")[0];

const trigger_option = localStorage.getItem("trigger_option");
const setting_option = localStorage.getItem("setting_option");
document.getElementById('settings-button').addEventListener('click', goToSettings);

if (trigger_option === "passive") {
  const basic_text = document.createElement("p");
  basic_text.innerHTML =
    "영어사운드매치를 사용해보려면 검색 버튼을 클릭하세요.";
  container.append(basic_text);
  // 이하 코드는 주석 처리된 부분을 포함하여 여기에 작성
} else {
  console.log("자동");
  // 이하 코드는 여기에 작성
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

function search() {
  console.log("검색 기능 수행");
  // 이하 검색 기능 구현 코드
}

