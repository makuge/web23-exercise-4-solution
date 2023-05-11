import { ResultFormBuilder, NoResultsBuilder } from "./builders.js";

function search() {
  /* Task 1.1: Initialize the searchForm correctly */
  const searchForm = document.getElementById("search");

  if (searchForm.reportValidity()) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const sectionElement = document.querySelector("section:nth-of-type(2)");

      while (sectionElement.childElementCount > 0) {
        sectionElement.firstChild.remove();
      }

      if (xhr.status === 200) {
        const results = JSON.parse(xhr.responseText);

        /* Task 1.3 Insert the results as specified. Do NOT
           forget to also cover the case in which no results
           are available. 
          */
        if (results.length > 0) {
          new ResultFormBuilder(results, addToCollection).appendTo(sectionElement);
        } else {
          new NoResultsBuilder(searchForm.query.value).appendTo(sectionElement);
        }
      }
    };

    /* Task 1.1: Finish the xhr configuration */
    xhr.open("GET", "/search?query=" + searchForm.query.value);
    xhr.send();
  }
}

function addToCollection() {
  /* Task X.X Call the POST /addMovies endpoint and pass the 
     array of imdbID to be added as payload */
  const checkedElements = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const checkedMovies = Array.from(checkedElements).map(element => element.value);

  const toMainPage = () => (location.href = "index.html");

  if (checkedMovies.length > 0) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        toMainPage();
      }
    };

    xhr.open("POST", "/movies");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(checkedMovies));
  }
}

window.onload = function () {
  document.getElementById("search").addEventListener("click", () => search());
};
