const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get All Users
 * Access: Public
 * Parameters: None
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// router.all("*", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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
    data: updateUser,
    message: "User Details Updated Successfully",
  });
});

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete User By ID
 * Access: Public
 * Parameters: id
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found With id:${id}`,
    });
  }

  const updateUser = users.filter((each) => each.id !== id);
  // const index=users.indexOf(user);
  // users.splice(index,1);
  // const updateUser=users;

  res.status(200).json({
    success: true,
    data: updateUser,
    message: "User Deleted Successfully",
  });
});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get All Users With Subscription Details
 * Access: Public
 * Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((each) => each.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User Not Found With ID ${id}`,
    });
  }

  // ✅ Convert date to days since epoch
  const getDateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    let days = Math.floor(date.getTime() / (1000 * 60 * 60 * 24)); // safer
    return days;
  };

  // ✅ Add subscription duration correctly
  const subscriptionType = (type, subscriptionDate) => {
    let days = getDateInDays(subscriptionDate);

    if (type === "Basic") {
      days += 90;
    } else if (type === "Standard") {
      days += 180;
    } else if (type === "Premium") {
      days += 365;
    }

    return days;
  };

  let returnDate = getDateInDays(user.returnDate);
  let currentDate = getDateInDays();
  let subscriptionDate = getDateInDays(user.subscriptionDate);

  // ✅ Now expiration is calculated properly
  let subscriptionExpiration = subscriptionType(
    user.subscriptionType,
    user.subscriptionDate
  );

  const data = {
    ...user,
    subscriptionExpired: subscriptionExpiration < currentDate,
    subscriptionDaysLeft: subscriptionExpiration - currentDate,

    // ✅ Keep returnDate always numeric, add overdue flag
    daysLeft: returnDate - currentDate,
    returnDate,
    isOverdue: returnDate < currentDate, // new field for clarity

    // ✅ Fine logic stays same, but more consistent
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
