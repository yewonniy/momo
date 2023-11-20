function onClick(e) {
    if (option1_a.checked === true) {
      localStorage.setItem("trigger_option", "passive");
    } else {
      localStorage.setItem("trigger_option", "active");
    }
    if (option2_a.checked === true) {
      localStorage.setItem("setting_option", "yes_pron");
    } else {
      localStorage.setItem("setting_option", "no_pron");
    }
    var params = new URLSearchParams(window.location.search);
    var returnUrl = params.get('returnUrl');
    if (returnUrl) {
        window.location.href = decodeURIComponent(returnUrl);
    } else {
        // returnUrl이 없는 경우의 처리 로직
    }
  }
  
  const trigger_option = localStorage.getItem("trigger_option");
  const setting_option = localStorage.getItem("setting_option");
  
  const save_button = document.getElementById("save-button");
  save_button.addEventListener("click", onClick);
  
  const option1_a = document.getElementById("option1_a");
  const option1_b = document.getElementById("option1_b");
  const option2_a = document.getElementById("option2_a");
  const option2_b = document.getElementById("option2_b");
  
  if (trigger_option === "passive") {
    option1_a.checked = true;
  } else {
    option1_b.checked = true;
  }
  if (setting_option === "yes_pron") {
    option2_a.checked = true;
  } else {
    option2_b.checked = true;
  }
  