import {
  backendURL,
  successNotification,
  errorNotification,
} from "../utils/utils.js";

// Login
const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
  e.preventDefault();

  document.querySelector("#form_login button").disabled = true;
  document.querySelector(
    "#form_login button"
  ).innerHTML = `<div class="spinner-border me-2" role="status">
                        </div>
                        <span>Loading...</span>`;

  const formData = new FormData(form_login);

  const response = await fetch(backendURL + "/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  let data;

  if (response.ok) {
    data = await response.json();
    localStorage.setItem("id", data.user.id);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.user.role);
    successNotification("Successfully logged in account.");
    if(data.user.role === 'admin'){
      window.location.pathname = "/dashboard.html";
    } else {
      window.location.pathname = "/index.html"
    }
  } else {
    data = await response.json();
    errorNotification(json.message, 5);
  }
};
