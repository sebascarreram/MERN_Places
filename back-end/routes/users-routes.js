const express = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//////////////////////////////
/////////////// List of all users
router.get("/", usersController.getUsers);
//////////////////////////////
/////////////// Signup
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name")
      .not()
      .isEmpty(),
    check("email")
      .normalizeEmail() // Example@example.com => example@example.com
      .isEmail(),
    check("password").isLength({ min: 6 })
  ],
  usersController.signup
);
//////////////////////////////
/////////////// Login
router.post("/login", usersController.login);

module.exports = router;
