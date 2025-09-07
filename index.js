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

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: `User Not Found ${id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

app.listen(PORT, () => {
  console.log(`Server Up And Running At http://localhost:${PORT}`);
});
