// Get token
const token = localStorage.getItem("token");

// Get references
const loginLink = document.getElementById("login-btn");
const dropdownMenu = document.getElementById("dropdown-menu");

// Toggle visibility based on token
if (token) {
  loginLink.style.display = "none";
  dropdownMenu.style.display = "block";
} else {
  loginLink.style.display = "block";
  dropdownMenu.style.display = "none";
}
