import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// // Get Logged User Info
// getLoggedUser();

// // Get Admin Pages
// showNavAdminPages();

// Logout Btn
const logoutBtn = document.getElementById("btn_logout");

// Add click event listener
logoutBtn.addEventListener("click", logout);

// Logout function
function logout() {
  // Make POST request to logout endpoint
  fetch(backendURL + "/api/logout", { method: "POST" })
    .then((response) => {
      if (response.ok) {
        successNotification("Logout Successful.");
      }
    })
    .then((data) => {
      // Clear localStorage token
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/";
    })
    .catch((err) => {
      console.log("Error logging out", err);
    });
}
