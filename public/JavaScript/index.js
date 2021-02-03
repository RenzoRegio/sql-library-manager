// const bookList = document.querySelectorAll("td > a");
// const authorList = document.querySelectorAll("td.author");
// const genreList = document.querySelectorAll("td.genre");
const searchBar = document.querySelector(".search-bar");
const searchForm = document.querySelector(".search-form");
const bookList = document.querySelectorAll("td.book");
const authorList = document.querySelectorAll("td.author");
const genreList = document.querySelectorAll("td.genre");
const searchByAuthor = document.querySelector(".author-search");
const searchByBook = document.querySelector(".book-search");
const searchByGenre = document.querySelector(".genre-search");

if (searchBar) {
  searchBar.addEventListener("keyup", (e) => {
    const searchValue = searchBar.value.toLowerCase();

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
      //Filter Books
      if (searchByBook) {
        performSearch(bookList, i);
      }
      if (searchByAuthor) {
        performSearch(authorList, i);
      }
      if (searchByGenre) {
        performSearch(genreList, i);
      }
    }
  });
}
