var express = require("express");
var router = express.Router();
const db = require("../models/index.js");
const { Book } = db.models;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

/* GET home - redirects to /books route. */
router.get("/", (req, res) => {
  res.redirect("/books");
});

/* GET books - shows the full list of books. */
router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const next = 1;
    const books = await Book.findAll({
      offset: 0,
      limit: 10,
      order: [["title", "ASC"]],
    });
    const allBooks = await Book.findAll();
    const bookLength = allBooks.length;
    const displayNextBtn = true;
    const displayPrevBtn = false;
    res.render("index", {
      displayNextBtn,
      displayPrevBtn,
      books,
      next,
      title: "Books",
      bookLength,
    });
  })
);

/**
 * Returns an object containing the variables that are needed to render the next or previous page
 * @param {Object} req - Request object from the router
 * @param {Bool} forward - Boolean value. If forward is true then we will provide the variables for the next page, else the next and previous variables will be altered for the previous page.
 */

async function renderBooks(req, forward) {
  let next = parseInt(req.params.page);
  const allBooks = await Book.findAll();
  let previous = next - 1;
  if (!forward) {
    next += 1;
    previous = next - 1;
  }
  const bookLength = allBooks.length;
  const offset = forward ? next * 10 : previous * 10;
  const books = await Book.findAll({
    limit: 10,
    offset: offset,
    order: [["title", "ASC"]],
  });
  return { bookLength, books, next, previous };
}

/**
 * Determines if the page should be rendered - Executed in the /next and /previous routes.
 * @param {Object} req - Request object from the router
 */

async function renderPage(req) {
  const allBooks = await Book.findAll();
  const total = Math.floor(allBooks.length / 10);
  const pageNumber = +req.params.page;
  let bool;
  if (pageNumber > total) {
    //If the page parameter is greater than the total number of pages then it will return an error and a false boolean to the route.
    const err = new Error("Page Not Found");
    err.statusCode = 404;
    bool = false;
    return { bool, err, total };
  } else {
    //If the page parameter is not greater than the total number of pages (meaning that it is the correct number within our library's known pages) then it will return true.
    bool = true;
    return { bool, total };
  }
}

/**
 * Determines if the navigation buttons for the current page should be displayed or not
 * @param {Object} req - Request object from the router.
 * @param {Object} page - Page object retrieved from the renderPage function that contains the total variable which is accessed in the function.
 */

async function displayNavigation(req, page) {
  const books = await Book.findAll();
  const currentURL = +req.params.page;
  let totalPages = books.length % 10 ? page.total : page.total - 1;
  let next = true;
  let previous = true;
  if (currentURL === totalPages) {
    next = false;
  } else if (currentURL === 0) {
    previous = false;
  }
  return { next, previous };
}

/* GET next page - renders the next page containing the next 10 books (following the current 10 books on the current page prior to executing the next route) from the database. */
router.get(
  "/books/next=:page",
  asyncHandler(async (req, res, next) => {
    const page = await renderPage(req);
    const navigation = await displayNavigation(req, page);
    if (!page.bool) {
      next(page.err);
    } else {
      const books = await renderBooks(req, (forward = true));
      books.next += 1;
      res.render("index", {
        displayPrevBtn: navigation.previous,
        displayNextBtn: navigation.next,
        books: books.books,
        next: books.next,
        previous: books.previous,
        bookLength: books.bookLength,
        title: `Books Page ${+req.params.page}`,
      });
    }
  })
);

/* GET previous page - renders the previous page containing the previous 10 books (from the current 10 books on the page prior to executing the previous route) from the database. */
router.get(
  "/books/previous=:page",
  asyncHandler(async (req, res, next) => {
    const page = await renderPage(req);
    const navigation = await displayNavigation(req, page);
    if (!page.bool) {
      next(page.err);
    } else {
      const books = await renderBooks(req, (forward = false));
      books.previous -= 1;
      res.render("index", {
        displayPrevBtn: navigation.previous,
        displayNextBtn: navigation.next,
        books: books.books,
        previous: books.previous,
        next: books.next,
        bookLength: books.bookLength,
        title: `Books Page ${+req.params.page}`,
      });
    }
  })
);

/* GET new book form  - Shows the create new book form. */
router.get(
  "/books/new",
  asyncHandler((req, res) => {
    res.render("new-book", {
      book: {},
      title: "New Book",
      btnValue: "Create Book",
    });
  })
);

/* POST new book form  - Posts a new book into the database. */
router.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
          btnValue: "Create Book",
        });
      } else {
        next(error);
      }
    }
  })
);

/* GET book detail form  - Shows the selected book's detail form. */
router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", {
        id: req.params.id,
        book,
        title: "PRAC",
        btnValue: "Update Book",
      });
    } else {
      const error = new Error();
      err.statusCode = 404;
      throw error;
    }
  })
);

/* POST update book - Updates book info in the database. */
router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        throw error;
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("update-book", {
          id: req.params.id,
          book,
          errors: error.errors,
          title: book.title,
          btnValue: "Update Book",
        });
      } else {
        throw error;
      }
    }
  })
);

/* POST delete book - Deletes the book from the database. */
router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    book.destroy();
    res.redirect("/");
  })
);

/**
 * Renders the books to be displayed on the page and provides the search feature that searches/filters the books based on the element parameter passed on to it.
 * @param {String} element - A string that is used as the title variable and determines which search category should be rendered.
 * @param {Object} res - Response object from the router.
 * @param {Array} order - Determines the order of the rendered books.
 */

async function searchCategory(element, res, order) {
  const books = await Book.findAll({ order });
  const bookLength = books.length;
  return res.render("search/search-base", {
    books,
    element,
    title: `Search by ${element}`,
    bookLength,
  });
}

/* GET search books by title  - Renders a search bar where the user can search through all titles and render results based on search query. */
router.get("/titles/search", (req, res) => {
  const order = [["title", "ASC"]];
  searchCategory("book", res, order);
});

/* GET search book by author  - Renders a search bar where the user can search through all authors and render results based on search query. */
router.get("/authors/search", (req, res) => {
  const order = [["author", "ASC"]];
  searchCategory("author", res, order);
});

/* GET search book by genre  - Renders a search bar where the user can search through all genres and render results based on search query. */
router.get("/genres/search", (req, res) => {
  const order = [["genre", "ASC"]];
  searchCategory("genre", res, order);
});

/* GET search book by year - Renders a search bar where the user can search through all years and render results based on search query. */
router.get("/years/search", (req, res) => {
  const order = [["year", "DESC"]];
  searchCategory("year", res, order);
});

/* 404 Error Handler */
router.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.statusCode = 404;
  next(error);
});

/* Global Error Handler */
router.use((err, req, res, next) => {
  if (err.statusCode === 404) {
    err.message = "Page Not Found";
    res.status(err.statusCode);
    err.description = "Sorry! We couldn't find the page you were looking for.";
    res.render("page-not-found", { err, title: "Page Not Found" });
  } else {
    err.statusCode = err.statusCode || 500;
    err.message = "Something went wrong on the server";
    res.status(err.statusCode);
    console.log(`${err.message}:`, err.statusCode);
    res.render("error", { err, title: "Page Not Found" });
  }
});

module.exports = router;
