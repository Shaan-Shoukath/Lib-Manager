const express = require("express");
const { users } = require("./data/users.json");

const app = express();

const PORT = 8081;

app.use(express.json());

app.get("/", (req, res) => {
  req.status(200).json({
    message: "Home Page:-)",
  });
});

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

//Get User By ID
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

//Create New User
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
app.listen(PORT, () => {
  console.log(`Server Up And Running At http://localhost:${PORT}`);
});
