const express = require("express");
const { books } = require("../data/books.json");

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

module.exports = router;
