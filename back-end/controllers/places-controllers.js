const fs = require("fs");
// ...rest of the initial code omitted for simplicity.
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
// const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

////////////////////////////////////////////////////////////////
/////////////// Get place by ID
////////////////////////////////////////////////////////////////

const getPlaceById = async (req, res, next) => {
  // http://localhost:5000/api/places/test
  // req.params => { pid: 'test' } .... Check it console.log(req.params)
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find a place for provided id", 404);
    return next(error);
  }

  // res.json({ place }); // { place } => to convert to { place: place }
  res.json({ place: place.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////////////
/////////////// Get place by creator ID
////////////////////////////////////////////////////////////////

const getPlacesByUserId = async (req, res, next) => {
  // http://localhost:5000/api/places/user/u1
  // req.params => { uid: 'u1' } .... Check it console.log(req.params)
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failes, please try again later",
      500
    );
    return next(error);
  }

  // if (!place || place.length === 0) {...}
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for provided USER id", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

////////////////////////////////////////////////////////////////
/////////////// Create Place
////////////////////////////////////////////////////////////////

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { title, description, address, image, location, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    location: {
      lat: 37.5487452,
      lng: -122.0614357
    },
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  // console.log(user);

  try {
    ////////
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

    ////////
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({
    message: "Success",
    place: createdPlace
  });
};

////////////////////////////////////////////////////////////////
/////////////// Update Place
////////////////////////////////////////////////////////////////

const updatePlaceById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Success updated",
    place: place.toObject({ getters: true })
  });
};

////////////////////////////////////////////////////////////////
/////////////// Delete Place
////////////////////////////////////////////////////////////////

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  const imagePath = place.image;

  try {
    ///////////////
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
    ///////////////
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({
    message: "Deleted place"
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
