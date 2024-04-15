   import {
  backendURL,
  showNavAdminPages,
  successNotification,
  errorNotification,
  getLoggedUser,
} from "../utils/utils.js";


document.addEventListener("DOMContentLoaded", () => {
  const paginateBtns = document.querySelectorAll("#btn_paginate_car");
  // const sortMinBtn = document.getElementById("sort-min");
  // const sortMaxBtn = document.getElementById("sort-max");
  // sortMinBtn.addEventListener("click", () => {
  //   getCars("", "", "", "asc"); 
  // });
  
  // sortMaxBtn.addEventListener("click", () => {
  //   getCars("", "", "", "desc");  
  // });
  if (paginateBtns) {
    paginateBtns.forEach((element) => {
      element.addEventListener("click", pageAction);
    });
  }
});

async function getCars(url = "", keyword = "", type = "",minPrice,maxPrice ) {
  // Add Loading if pagination or search is used; Remove if its not needed
  if (url != "" || keyword != "") {
    document.getElementById(
      "get_car"
    ).innerHTML = `<div class="col-sm-12 d-flex justify-content-center align-items-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <b class="ms-2">Loading Data...</b>
                    </div>`;
  }

  let queryParams = {
    keyword,
    type,
    min_price: minPrice, 
    max_price: maxPrice
  }

  // Get Carousel API Endpoint; Caters search
  const response = await fetch(backendURL + "/api/unit?" + new URLSearchParams(queryParams), {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.headers.get("content-type").includes("application/json")) {
    try {
      const data = await response.text(); 
      console.log(data);
      const json = JSON.parse(data);
      // Get Each Json Elements and merge with Html element and put it into a container
      let rows = "";

      // Now caters pagination; You can use "json.data" if using pagination or "json" only if no pagination
      json.data.forEach((units) => {
        rows += `
                          
        <tr data-id="${units.car_ID}">
          <td>${units.car_ID}</td>
          <td>${units.make} ${units.model_name} ${units.model_year}</td>
          <td>${units.type}</td>
          <td>${units.color}</td>  
          <td>${units.price}</td>
          <td><img src="${backendURL}/storage/${units.image1}" width="100%" height="225px"></td>
       </tr>         
                      `;
      });

      // Use the container to display the fetch data
      document.getElementById("get_car").innerHTML = rows;

      // Get Each Json Elements and merge with Html element and put it into a container
      let pagination = "";
      // Now caters pagination; Remove below if no pagination
      json.links.forEach((element) => {
        pagination += `<li class="page-item">
                          <a class="page-link
                          ${element.url == null ? " disabled" : ""}
                          ${element.active ? " active" : ""}
                          " href="#" id="btn_paginate_car" data-url="${
                            element.url
                          }">
                              ${element.label}
                          </a>
                      </li>`;
      });
      // Use the container to display the fetch data
      document.getElementById("get_pagination_car").innerHTML = pagination;

      // Assign click event on Page Btns
      document.querySelectorAll("#btn_paginate_car").forEach((element) => {
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
const filterType = document.getElementById('filterType');

filterType.addEventListener('change', () => {
  const type = filterType.value; 
  getCars('', type);
})

// Search Form
const form_search = document.getElementById("form_search");
form_search.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_search);
  const filterType = document.getElementById('filterType').value;
  const minPriceInput = form_search.querySelector('input[name="minPrice"]');
  const maxPriceInput = form_search.querySelector('input[name="maxPrice"]');

  // Get values  
  const minPrice = minPriceInput.value;
  const maxPrice = maxPriceInput.value;

  getCars("", formData.get("keyword"), filterType,minPrice,maxPrice);
};

const pageAction = async (e) => {
  e.preventDefault();
  // Get url from data-url attrbute within the btn_paginate_car anchor tag
  const url = e.target.getAttribute("data-url");
  // Refresh card list
  getCars(url);
};
getCars();