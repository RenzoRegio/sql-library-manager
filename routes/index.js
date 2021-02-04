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

/* GET home page. */
router.get("/", (req, res) => {
  res.redirect("/books");
});

router.get(
  "/books",
  asyncHandler(async (req, res) => {
    const next = 1;
    const books = await Book.findAll({
      offset: 0,
      limit: 10,
    });
    const allBooks = await Book.findAll();
    const bookLength = allBooks.length;
    res.render("index", { books, next, title: "Books", bookLength });
  })
);

//next

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
  });
  return { bookLength, books, next, previous };
}

router.get("/books/next=:page", async (req, res) => {
  const books = await renderBooks(req, (forward = true));
  books.next += 1;
  res.render("index", {
    books: books.books,
    next: books.next,
    previous: books.previous,
    bookLength: books.bookLength,
  });
});

//prev

router.get("/books/previous=:page", async (req, res) => {
  const books = await renderBooks(req, (forward = false));
  books.previous -= 1;
  res.render("index", {
    books: books.books,
    previous: books.previous,
    next: books.next,
    bookLength: books.bookLength,
  });
});

//

router.get("/books/new", (req, res) => {
  res.render("new-book", { title: "New Book" });
});

router.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      await Book.create(req.body);
      res.redirect("/books");
    } catch (error) {
      console.log(error.name);
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        res.render("new-book", {
          book,
          errors: error.errors,
          title: "New Book",
        });
      } else {
        next(error);
      }
    }
  })
);

//SEARCH!

async function searchCategory(element, res, order) {
  const books = await Book.findAll({ order: order });
  const bookLength = books.length;
  return res.render("search/search-base", {
    books,
    element,
    title: `Search by ${element}`,
    bookLength,
  });
}

router.get("/books/search", (req, res) => {
  const order = [["title", "ASC"]];
  searchCategory("book", res, order);
});

router.get("/authors/search", async (req, res) => {
  const order = [["author", "ASC"]];
  searchCategory("author", res, order);
});

router.get("/genres/search", async (req, res) => {
  const order = [["genre", "ASC"]];
  searchCategory("genre", res, order);
});

router.get("/years/search", async (req, res) => {
  const order = [["year", "DESC"]];
  searchCategory("year", res, order);
});
//

router.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book, title: book.title });
  })
);

router.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/");
  })
);

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    book.destroy();
    res.redirect("/");
  })
);

router.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.statusCode = 404;
  next(error);
});

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
