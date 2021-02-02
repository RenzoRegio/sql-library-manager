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

router.post("/books/new", async (req, res) => {
  await Book.create(req.body);
  res.redirect("/books");
});

router.get("/books/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render("update-book", { book, title: book.title });
});

router.post("/books/:id", async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body);
  res.redirect("/");
});
module.exports = router;
