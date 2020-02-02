// ...rest of the initial code omitted for simplicity.
const { validationResult } = require("express-validator");
const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const User = require("../models/user");

////////////////////////////////////////////////////////////////
/////////////// Get list of all users
////////////////////////////////////////////////////////////////

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, please try again later", 422)
    );
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

////////////////////////////////////////////////////////////////
/////////////// Create new user
////////////////////////////////////////////////////////////////

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signup up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image: "urlImage",
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signup up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Success",
    place: createdUser.toObject({ getters: true })
  });
};

////////////////////////////////////////////////////////////////
/////////////// Login
////////////////////////////////////////////////////////////////

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
