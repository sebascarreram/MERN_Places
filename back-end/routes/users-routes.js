const express = require("express");
const { check } = require("express-validator");

const UsersControllers = require("../controllers/users-controllers");

const router = express.Router();

//////////////////////////////
/////////////// List of all users
router.get("/", UsersControllers.getUsers);
//////////////////////////////
/////////////// Signup
router.post(
  "/signup",
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail() // Example@example.com => example@example.com
      .isEmail(),
    check("password").isLength({ min: 6 })
  ],
  UsersControllers.signup
);
//////////////////////////////
/////////////// Login
router.post("/login", UsersControllers.login);

module.exports = router;
