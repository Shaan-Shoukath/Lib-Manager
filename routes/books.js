const express = require("express");
const { books } = require("../data/books.json");
const e = require("express");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get All Books
 * Access: Public
 * Parameters: None
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: books,
  });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get Book By ID
 * Access: Public
 * Parameters: id
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book Not Found ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

/**
 * Route: /books
 * Method: POST
 * Description: Create New Book
 * Access: Public
 * Parameters: id, name, author, genre, publisher, price
 */
router.post("/", (req, res) => {
  const { id, name, author, genre, price, publisher } = req.body;
  if (!id || !name || !author || !genre || !price || !publisher) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Complete Details",
    });
  }

  const book = books.find((each) => each.id === id);
  if (book) {
    return res.status(400).json({
      success: false,
      message: `Book Already Exists With ID ${id}`,
    });
  }

  books.push({
    id,
    name,
    author,
    genre,
    price,
    publisher,
  });

  res.status(201).json({
    success: true,
    message: "Book Created Successfully",
    data: { id, name, author, genre, price, publisher },
  });
});

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Update Book By ID
 * Access: Public
 * Parameters: id, name, author, genre, publisher, price
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book Not Found With ID ${id}`,
    });
  }
  //   Object.assign(book, data);
  //   const { name, author, genre, price, publisher } = req.body;
  const updatedBook = books.map((each) => {
    if (each.id === id) {
      return { ...each, ...data };
    }
    return each;
  });
  //   book.name = name;
  //   book.author = author;
  //   book.genre = genre;
  //   book.price = price;
  //   book.publisher = publisher;

  res.status(200).json({
    success: true,
    message: `Book Updated Successfully With ID ${id}`,
    data: book,
  });
});

/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Delete Book By ID
 * Access: Public
 * Parameters: id
 */

module.exports = router;
