// ...rest of the initial code omitted for simplicity.
const { validationResult } = require("express-validator");
const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Mercedez Ruiz",
    email: "example@example.com",
    password: "example12344"
  }
];

////////////////////////////////////////////////////////////////
/////////////// Get list of all users
////////////////////////////////////////////////////////////////

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

////////////////////////////////////////////////////////////////
/////////////// Create new user
////////////////////////////////////////////////////////////////

const signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }

  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find(user => user.email === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const createdUser = {
    id: uuid(),
    name, // name: name
    email,
    password
  };

  DUMMY_USERS.push(createdUser); // unshift(createdUser)

  res.status(201).json({
    message: "Success",
    place: createdUser
  });
};

////////////////////////////////////////////////////////////////
/////////////// Login
////////////////////////////////////////////////////////////////

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to wrong",
      401
    );
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
