$(document).ready(function () {
  let logbtn = $("#loginBTN");
  let regbtn = $("#RegisterBTN");
  let showHidebtn = $("#showHideBTN");
  let showHidebtnTWO = $("#showHideBTN2");
  let keyInput = $("#adminKey");
  let passInput = $("#pass");
  let userInput = $("#user");

  //Show hide button
  showHidebtn.on("click", function () {
    if (passInput.attr("type") === "password") {
      passInput.attr("type", "text");
      $(this).text("Hide");
    } else {
      passInput.attr("type", "password");
      $(this).text("Show");
    }
  });

  showHidebtnTWO.on("click", function () {
    if (keyInput.attr("type") === "password") {
      keyInput.attr("type", "text");
      $(this).text("Hide");
    } else {
      keyInput.attr("type", "password");
      $(this).text("Show");
    }
  });
  //Show hide button END

  const accountStorage =
    JSON.parse(localStorage.getItem("accountStorage")) || {};

  function addUser(username, password, additionalInfo = {}) {
    accountStorage[username] = [{ password: password, ...additionalInfo }];
    localStorage.setItem("accountStorage", JSON.stringify(accountStorage));
  }

  //ALERT START
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div id="warning" class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"><i class="fa-solid fa-check"></i></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };

  //ALERT END

  let loggedIn = JSON.parse(localStorage.getItem("loggedIn")) || {
    username: "",
    adminStat: "",
  };

  //Register Function
  regbtn.on("click", function () {
    const username = userInput.val();
    const password = passInput.val();
    const adminKey = keyInput.val();
    let adminStatus = false;

    if (username && password) {
      if (adminKey == "1478") {
        adminStatus = true;
      }
      addUser(username, password, { admin: `${adminStatus}` });
      userInput.val("");
      passInput.val("");
      keyInput.val("");
      adminStatus = false;
      appendAlert("Account Created", "success");
    } else if ((!username && !password) || !username || !password) {
      appendAlert("Please fill in the missing fields", "danger");
    }
  });

  //Register Function End

  //Log-In

  function logInUser(username, adminStat) {
    loggedIn = { username, adminStat };
    localStorage.setItem("loggedIn", JSON.stringify(loggedIn));
  }

  function logOutUser() {
    loggedIn = { username: "", adminStat: "" };
    localStorage.removeItem("loggedIn");
  }

  logbtn.on("click", function () {
    const username = userInput.val();
    const password = passInput.val();

    if (username && password) {
      if (accountStorage[username] && accountStorage[username].length > 0) {
        const storedPassword = accountStorage[username][0].password;
        const storedAdminStatus = accountStorage[username][0].admin;
        if (password === storedPassword) {
          logInUser(username, storedAdminStatus);
          appendAlert("Logged in", "success");
        } else if (password != storedPassword) {
          appendAlert("Incorrect Password. Please try again", "danger");
        }
      } else if (!accountStorage[username]) {
        appendAlert("Username does not exist. Please Register", "danger");
      }
    }
  });

  //Log-In End
});
