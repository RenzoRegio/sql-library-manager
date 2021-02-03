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
    const books = await Book.findAll();
    res.render("index", { books, title: "Books" });
  })
);

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

router.get("/books/search", async (req, res) => {
  const books = await Book.findAll();
  const book = true;
  res.render("search/search-base", { books, book });
});

router.get("/authors/search", async (req, res) => {
  const books = await Book.findAll();
  const author = true;
  res.render("search/search-base", { books, author });
});

router.get("/genres/search", async (req, res) => {
  const books = await Book.findAll();
  const genre = true;
  res.render("search/search-base", { books, genre });
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
