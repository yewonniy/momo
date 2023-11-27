const container = document.getElementsByClassName("results-container")[0];

const trigger_option = localStorage.getItem("trigger_option");
const setting_option = localStorage.getItem("setting_option");
document
  .getElementById("settings-button")
  .addEventListener("click", goToSettings);

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

if (trigger_option === "passive") {
  const basic_text = document.createElement("p");
  basic_text.innerHTML = "영어사운드매치를 사용하려면 검색 버튼을 클릭하세요.";
  container.append(basic_text);
  // 검색 트래킹 x
  // 값을 가져올 때 setting_option 확인
  // const 가져온값 = await fetch('url')
  // const jsonData = await response.json();
  // console.log(jsonData);
  showingLists(response, setting_option);
} else {
  // automatic

  // content 검색 트래킹
  // background.js에 요청
  // background.js에서 end point에 fetch
  // const 가져온값 = await fetch('url')
  // const jsonData = await response.json();
  showingLists(response, setting_option);
}

function goToSettings() {
  chrome.runtime.sendMessage({ action: "getTabUrl" }, function (response) {
    if (chrome.runtime.lastError) {
      console.error("Runtime Error: ", chrome.runtime.lastError);
      return;
    }

    if (response && response.url) {
      var settingsUrl =
        chrome.runtime.getURL("setting.html") +
        "?returnUrl=" +
        encodeURIComponent(response.url);
      window.open(settingsUrl, "_blank");
    } else {
      console.error("Error getting the tab URL or no URL present");
    }
  });
}

function search() {
  console.log("검색 기능 수행");
  // 이하 검색 기능 구현 코드
}
