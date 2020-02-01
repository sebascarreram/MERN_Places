const express = require("express");

const UsersControllers = require("../controllers/users-controllers");

const router = express.Router();

//////////////////////////////
/////////////// List of all users
router.get("/", UsersControllers.getUsers);
//////////////////////////////
/////////////// Signup
router.post("/signup", UsersControllers.signup);
//////////////////////////////
/////////////// Login
router.post("/login", UsersControllers.login);

module.exports = router;
