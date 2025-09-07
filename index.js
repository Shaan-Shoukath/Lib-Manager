const express = require("express");
const { users } = require("./data/users.json");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Home Page:-)",
  });
});
/**
 * Route: /users
 * Method: GET
 * Description: Get All Users
 * Access: Public
 * Parameters: None
 */
app.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// app.all("*", (req, res) => {
//   res.status(500).json({
//     message: "Not Built Yet",
//   });
// });

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get User By ID
 * Access: Public
 * Parameters: id
 */
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Route: /users
 * Method: POST
 * Description: Create New User
 * Access: Public
 * Parameters: id, name, surname, email, subscriptionType, subscriptionDate
 */
app.post("/users", (req, res) => {
  const { id, name, surname, email, subscriptionType, subscriptionDate } =
    req.body;
  if (
    !id ||
    !name ||
    !surname ||
    !email ||
    !subscriptionType ||
    !subscriptionDate
  ) {
    return res.status(400).json({
      success: false,
      message: "Please Provide All Details",
    });
  }

  const user = users.find((each) => each.id === id);
  if (user) {
    return res.status(409).json({
      success: false,
      message: `User Already Exists With id:${id}`,
    });
  }

  users.push({ id, name, surname, email, subscriptionType, subscriptionDate });
  res.status(201).json({
    success: true,
    message: "User Created Successfully",
  });
});

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Update User By ID
 * Access: Public
 * Parameters: id data
 */
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found With id:${id}`,
    });
  }

  const updateUser = users.map((each) => {
    if (each.id === id) {
      return {
        ...each,
        ...data,
      };
    }
    return each;
  });

  res.status(200).json({
    success: true,
    message: "User Details Updated Successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server Up And Running At http://localhost:${PORT}`);
});
