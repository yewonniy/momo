document.addEventListener('DOMContentLoaded', function() {
    // 새로운 도구 창 생성
    var toolDiv = document.createElement('div');
    toolDiv.id = 'myExtensionToolDiv';
    toolDiv.textContent = '여기에 도구 창의 내용';
    toolDiv.style.cssText = 'position: fixed; top: 100px; right: 20px; background-color: white; border: 1px solid black; padding: 10px;';
  
    // Google 검색 결과 페이지에 도구 창 추가
    document.body.appendChild(toolDiv);
  });

document.addEventListener('DOMContentLoaded', function() {
    var settingsButton = document.getElementById('settings-button');
    if(settingsButton) {
        settingsButton.addEventListener('click', goToSettings);
    }

    var searchButton = document.getElementById('search-button');
    if(searchButton) {
        searchButton.addEventListener('click', search);
    }
});

function goToSettings() {
    window.location.href = "setting.html";
}

function search() {
    console.log("검색 기능 수행");
    // 검색 기능 관련 코드
}
