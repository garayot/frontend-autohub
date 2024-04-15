import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";

// Get Logged User Info
// getLoggedUser();

// // Get Admin Pages
// showNavAdminPages();

// Get All Data

document.addEventListener("DOMContentLoaded", () => {
  const paginateBtns = document.querySelectorAll("#btn_paginate");

  if (paginateBtns) {
    paginateBtns.forEach((element) => {
      element.addEventListener("click", pageAction);
    });
  }
});

async function addOrder(event) {
  const carId = event.target.closest("[data-id]").dataset.id;

  const userId = localStorage.getItem("id");

  const today = new Date().toISOString().split("T")[0];

  const data = {
    customer_ID: userId,
    car_ID: carId,
    date: today,
    status: "incomplete",
    // sales_total: 0, // sales total can be updated later
  };

  const response = await fetch(backendURL + "/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errors = await response.json();
      console.error(errors);
    } else {
      errorNotification("Need to login to order", 5);
    }
    return;
  }

  const order = await response.json();
  successNotification("Successfully ordered", 5);
  console.log("Order added successfully", order);
}

async function getDatas(url = "", keyword = "") {
  // Add Loading if pagination or search is used; Remove if its not needed
  if (url != "" || keyword != "") {
    document.getElementById(
      "get_data"
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
  const response = await fetch(backendURL + "/api/home" + queryParams, {
    headers: {
      Accept: "application/json",
    },
  });

  // Get response if 200-299 status code
  if (response.headers.get("content-type").includes("application/json")) {
    try {
      const json = JSON.parse(await response.text());

      // Get Each Json Elements and merge with Html element and put it into a container
      let container = "";

      // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
      json.data.forEach((element) => {
        container += `
                          
      <div class="col-4">
      <div data-id="${element.car_ID}">

      <div class="p-4 mb-4">

        <div class="card h-100">

            <img class="card-img-top" src="${backendURL}/storage/${element.image1}" width="100%" height="225px">

          <div class="card-body">

            <h5 class="card-title">${element.make} ${element.model_name}</h5>

            <h6 class="card-subtitle mb-2 text-body-secondary">${element.model_year}</h6>

            <p class="card-text">${element.description}</p>
            <h6 class="card-subtitle mb-2 text-body-secondary"><b>Php ${element.price}</b></h6>

          </div>

          <div class="card-footer">

            <button

              class="btn btn-primary"

            >

              View Details

            </button>

            <button id="add_order" class="btn btn-secondary">Order Now</button>

          </div>

        </div>

      </div>

    </div>

      </div>
         </div>           
                      `;
      });

      // Use the container to display the fetch data
      document.getElementById("get_data").innerHTML = container;

      // Get Each Json Elements and merge with Html element and put it into a container
      let pagination = "";
      // Now caters pagination; Remove below if no pagination
      json.links.forEach((element) => {
        pagination += `<li class="page-item">
                          <a class="page-link
                          ${element.url == null ? " disabled" : ""}
                          ${element.active ? " active" : ""}
                          " href="#" id="btn_paginate" data-url="${
                            element.url
                          }">
                              ${element.label}
                          </a>
                      </li>`;
      });
      // Use the container to display the fetch data
      document.getElementById("get_pagination").innerHTML = pagination;

      // Assign click event on Page Btns
      document.querySelectorAll("#btn_paginate").forEach((element) => {
        element.addEventListener("click", pageAction);
      });

      document.querySelectorAll("#add_order").forEach((btn) => {
        btn.addEventListener("click", addOrder);
      });
    } catch (error) {
      console.log("Invalid JSON", response);
    }
  }
  //asdsad
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

  getDatas("", formData.get("keyword"));
};
const pageAction = async (e) => {
  e.preventDefault();
  // Get url from data-url attrbute within the btn_paginate anchor tag
  const url = e.target.getAttribute("data-url");
  // Refresh card list
  getDatas(url);
};
getDatas();
