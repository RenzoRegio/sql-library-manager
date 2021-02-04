// const bookList = document.querySelectorAll("td > a");
// const authorList = document.querySelectorAll("td.author");
// const genreList = document.querySelectorAll("td.genre");
const searchBar = document.querySelector(".search-bar");
const searchForm = document.querySelector(".search-form");
const bookList = document.querySelectorAll("td.book");
const authorList = document.querySelectorAll("td.author");
const genreList = document.querySelectorAll("td.genre");
const yearList = document.querySelectorAll("td.year");
const searchByAuthor = document.querySelector(".author-search");
const searchByBook = document.querySelector(".book-search");
const searchByGenre = document.querySelector(".genre-search");
const searchByYear = document.querySelector(".year-search");

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
      if (searchByYear) {
        performSearch(yearList, i);
      }
    }
  });
}

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

const trList = document.querySelectorAll("tr");
if (trList.length < 11) {
  nextBtn.style.display = "none";
}

for (let i = 0; i < trList.length; i++) {
  const book = trList[i].textContent;
  if (book.includes("Harry Potter") && nextBtn) {
    prevBtn.style.display = "none";
  }
}

const bookTitle = document.querySelector(".books-title");
for (let i = 0; i < bookList.length; i++) {
  const books = bookList[i].firstChild;
  if (bookTitle.textContent.includes("author")) {
    const authors = authorList[i];
    authors.style.fontWeight = "700";
    books.style.fontWeight = "400";
  }
  if (bookTitle.textContent.includes("genre")) {
    const genres = genreList[i];
    genres.style.fontWeight = "700";
    books.style.fontWeight = "400";
  }
  if (bookTitle.textContent.includes("year")) {
    const years = yearList[i];
    years.style.fontWeight = "700";
    books.style.fontWeight = "400";
  }
}
