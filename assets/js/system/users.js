import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const paginateBtns = document.querySelectorAll("#btn_paginate_user");

  if (paginateBtns) {
    paginateBtns.forEach((element) => {
      element.addEventListener("click", pageAction);
    });
  }
});

async function getUsers(url = "", keyword = "") {
  // Add Loading if pagination or search is used; Remove if its not needed
  if (url != "" || keyword != "") {
    document.getElementById(
      "get_user"
    ).innerHTML = `<div class="col-sm-12 d-flex justify-content-center align-items-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <b class="ms-2">Loading Data...</b>
                    </div>`;
  }

  // To cater pagination and search feature
  let queryParams =
    "?" +
    (url != "" ? new URL(url).searchParams + "&" : "") + // Remove this line if not using pagination
    (keyword != "" ? "keyword=" + keyword : "");

  // Get Carousel API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/user" + queryParams, {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.headers.get("content-type").includes("application/json")) {
    try {
      const json = JSON.parse(await response.text()); 

      // Get Each Json Elements and merge with Html element and put it into a container
      let rows = "";

      // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
      json.data.forEach((user) => {
        rows += `
                          
        <tr data-id="${user.id}">
          <td>${user.id}</td>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>  
          <td>${user.address}</td>
          <td>${user.date_of_birth}</td>
          <td>${user.national_ID}</td>
       </tr>         
                      `;
      });

      // Use the container to display the fetch data
      document.getElementById("get_user").innerHTML = rows;

      // Get Each Json Elements and merge with Html element and put it into a container
      let pagination = "";
      // Now caters pagination; Remove below if no pagination
      json.links.forEach((element) => {
        pagination += `<li class="page-item">
                          <a class="page-link
                          ${element.url == null ? " disabled" : ""}
                          ${element.active ? " active" : ""}
                          " href="#" id="btn_paginate_user" data-url="${
                            element.url
                          }">
                              ${element.label}
                          </a>
                      </li>`;
      });
      // Use the container to display the fetch data
      document.getElementById("get_pagination_user").innerHTML = pagination;

      // Assign click event on Page Btns
      document.querySelectorAll("#btn_paginate_user").forEach((element) => {
        element.addEventListener("click", pageAction);
      });

      // document.querySelectorAll("#add_order").forEach((btn) => {
      //   btn.addEventListener("click", addOrder);
      // });
    } catch (error) {
      console.log("Invalid JSON", response);
      console.log('Error parsing JSON', error);

    }
  }
  // Get response if 400+ or 500+ status code
  else {
    errorNotification("HTTP-Error: " + response.status);
  }
}

// Search Form
const form_search = document.getElementById("form_search");
form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);

  getUsers("", formData.get("keyword"));
};
const pageAction = async (e) => {
  e.preventDefault();
  // Get url from data-url attrbute within the btn_paginate_user anchor tag
  const url = e.target.getAttribute("data-url");
  // Refresh card list
  getUsers(url);
};
getUsers();