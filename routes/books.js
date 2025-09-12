const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

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

  // if (!data || Object.keys(data).length === 0) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Please Provide Data To Update",
  //   });
  // }

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
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const book = books.findIndex((each) => each.id === id);
  if (!book) {
    return res.status(404).json({
      success: false,
      message: `Book Not Found With ID ${id}`,
    });
  }
  const updatedBooks = books.filter((each) => each.id !== id);

  res.status(200).json({
    success: true,
    message: `Book Deleted Successfully With ID ${id}`,
    data: updatedBooks,
  });
});

/**
 * Route: /books/issued/for-users
 * Method: GET
 * Description: Get All Issued Books
 * Access: Public
 * Parameters: None
 */
router.get("/issued/for-users", (req, res) => {
  // const issuedBooks = books.filter((each) => each.issued);
  const usersWithIssuedBooks = users.filter((each) => {
    if (each.issuedBook) {
      return each;
    }
  });
  const issuedBooks = [];

  usersWithIssuedBooks.forEach((user) => {
    const book = books.find((each) => each.id === user.issuedBook);

    book.issuedBy = each.name;
    book.issuedDate = each.issuedDate;
    book.returnDate = each.returnDate;
    issuedBooks.push(book);
  });

  if (!issuedBooks === 0) {
    return res.status(404).json({
      success: false,
      message: "No Books Issued",
    });
  }

  res.status(200).json({
    success: true,
    data: issuedBooks,
  });
});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get All Users With Subscription Details
 * Access: Public
 * Parameters: id
 */
router.get("/users/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found With ID ${id}`,
    });
  }

  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  };

  const subscriptionType = (date) => {
    if (data === "Basic") {
      date = date + 90;
    } else if (data === "Standard") {
      date = date + 180;
    } else if (data === "Premium") {
      date = date + 365;
    }
    return date;
  };

  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);
  let subscriptionExpiration = subscriptionType(user.subscriptionType);

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    subscriptionDaysLeft: subscriptionExpiration - currentDate,
    daysLeft: returnDate - currentDate,
    returnDate: returnDate < currentDate ? "Book Is Overdue" : returnDate,
    fine:
      returnDate < currentDate
        ? subscriptionExpiration <= currentDate
          ? 200
          : 100
        : 0,
  };
  res.status(200).json({
    success: true,
    data: data,
  });
});
module.exports = router;
