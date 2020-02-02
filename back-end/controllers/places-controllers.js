// ...rest of the initial code omitted for simplicity.
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");
const User = require("../models/user");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageURL:
      "https://images.unsplash.com/photo-1502104034360-73176bb1e92e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7482476,
      lng: -73.9873916
    },
    creator: "u1"
  }
];

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

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }
////////////////////////////////
////////////////////////////////
////////////////////////////////

////////////////////////////////////////////////////////////////
/////////////// Get place by creator ID
////////////////////////////////////////////////////////////////

const getPlacesByUserId = async (req, res, next) => {
  // http://localhost:5000/api/places/user/u1
  // req.params => { uid: 'u1' } .... Check it console.log(req.params)
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failes, please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for provided USER id", 404)
    );
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) }); // { places } => to convert to { places: places }
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
  // const title = req.body.title
  let coordinates;

  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  const createdPlace = new Place({
    title,
    description,
    image,
    location,
    address,
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

  console.log(user);

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
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Deleted place"
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
