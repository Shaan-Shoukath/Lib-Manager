const express = require("express");
const { users } = require("./data/users.json");

const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

const app = express();

const PORT = 8081;

app.use(express.json());
/**
 * Route: / (Homepage)
 * Method: GET
 * Description: Home Page
 * Access: Public
 * Parameters: None
 */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Home Page:-)",
  });
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);


app.listen(PORT, () => {
  console.log(`Server Up And Running At http://localhost:${PORT}`);
});
