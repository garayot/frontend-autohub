function setRouter() {
  switch (window.location.pathname) {
    // If you are logged in you cant access outside pages; redirect to dashboard
    case "/":
    case "/login.html":
      // case "/register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname = "/index.html";
      }
      break;

    // If you are not logged in you cant access dashboard pages; redirect to /
    case "/profile.html":
    case "/order.html":
    case "/dashboard.html":
    case "/cars.html":
    case "/ordersAdmin.html":
      // case "/slides.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname = "/index.html";
      }
      break;

    // For Admin Users only; redirect to /dashboard
    case "/dashboard.html":
      if (localStorage.getItem("role") != "admin") {
        window.location.pathname = "/dashboard.html";
      }
      break;

    default:
      break;
  }
}

export { setRouter };
