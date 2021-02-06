const searchBar = document.querySelector(".search-bar");
const bookList = document.querySelectorAll("td.book");
const authorList = document.querySelectorAll("td.author");
const genreList = document.querySelectorAll("td.genre");
const yearList = document.querySelectorAll("td.year");
const searchByAuthor = document.querySelector(".author-search");
const searchByTitle = document.querySelector(".book-search");
const searchByGenre = document.querySelector(".genre-search");
const searchByYear = document.querySelector(".year-search");

/**
 * Search Function: Depending on the search input's value AND the current search container's class 
 on the page (div(class=`${element}-search` on category-search.pug) - which determines which conditional to execute the search function, 
 then the function will filter through the books based on the search input's value.
 */

if (searchBar) {
  searchBar.addEventListener("keyup", (e) => {
    const searchValue = searchBar.value.toLowerCase();

    /**
     * Displays or hides the book depending on the search input's value
     * @param {Array} arr - Array containing the list of books to filter through. Each array passed is customized based on which category to filter.
     * @param {Number} i - Number that indicates the value from the for loop.
     */

    function performSearch(arr, i) {
      const elements = arr[i].textContent.toLowerCase();
      if (!elements.includes(searchValue)) {
        arr[i].parentNode.style.display = "none";
      } else {
        arr[i].parentNode.style.display = "";
      }
    }

    e.preventDefault();
    for (let i = 0; i < bookList.length; i++) {
      //Filter by Title
      if (searchByTitle) {
        performSearch(bookList, i);
      }
      //Filter by Author
      if (searchByAuthor) {
        performSearch(authorList, i);
      }
      //Filter by Genre
      if (searchByGenre) {
        performSearch(genreList, i);
      }
      //Filter by Year
      if (searchByYear) {
        performSearch(yearList, i);
      }
    }
  });
}

const bookTitle = document.querySelector(".books-title");
const bookIds = document.querySelectorAll("td.id");

/**
 * Depending on the current search page, the fontWeight is changed. For example, if the search query is for Authors then all authors will be in bold characters.
 * @param {Array} arr - Array containing the list of books to filter through. Each array passed is customized based on which category to filter.
 * @param {Number} i - Number that indicates the value from the for loop.
 */

function contentStyle(arr, i) {
  const books = bookList[i].firstChild;
  const element = arr[i];
  element.style.fontWeight = "700";
  books.style.fontWeight = "400";
}

for (let i = 0; i < bookList.length; i++) {
  if (bookTitle.textContent.includes("author")) {
    contentStyle(authorList, i);
  }
  if (bookTitle.textContent.includes("genre")) {
    contentStyle(genreList, i);
  }
  if (bookTitle.textContent.includes("year")) {
    contentStyle(yearList, i);
  }
}

/**
 * This section is dedicated for handling the form's validation errors
 * If the error is displayed, a red outline/border will be added to the input's element.
 */

const errContainer = document.querySelector("ul.error");

if (errContainer) {
  const authorInput = document.querySelector("#author");
  const titleInput = document.querySelector("#title");
  for (let i = 0; i < errContainer.children.length; i++) {
    const errorMessage = errContainer.children[i].textContent;
    if (errorMessage.includes("title")) {
      titleInput.style.border = "2px solid red";
      titleInput.style.boxShadow = "1px 1px 1px red";
    } else if (errorMessage.includes("author")) {
      authorInput.style.border = "2px solid red";
      authorInput.style.boxShadow = "1px 1px 1px red";
    }
  }
}
