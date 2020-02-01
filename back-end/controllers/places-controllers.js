const uuid = require("uuid/v4");
const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
  // http://localhost:5000/api/places/test
  // req.params => { pid: 'test' } .... Check it console.log(req.params)
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find(place => place.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for provided id", 404);
  }

  res.json({ place }); // { place } => to convert to { place: place }
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }
////////////////////////////////
////////////////////////////////
////////////////////////////////

////////////////////////////////////////////////////////////////
/////////////// Get place by creator ID
////////////////////////////////////////////////////////////////

const getPlaceByUserId = (req, res, next) => {
  // http://localhost:5000/api/places/user/u1
  // req.params => { uid: 'u1' } .... Check it console.log(req.params)
  const userId = req.params.uid;

  const user = DUMMY_PLACES.find(user => user.creator === userId);

  if (!user) {
    return next(
      new HttpError("Could not find a place for provided USER id", 404)
    );
  }

  res.json({ user }); // { user } => to convert to { user: user }
};

////////////////////////////////////////////////////////////////
/////////////// Create Place
////////////////////////////////////////////////////////////////

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  // const title = req.body.title
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); // unshift(createdPlace)

  res.status(201).json({
    message: "Success",
    place: createdPlace
  });
};

////////////////////////////////////////////////////////////////
/////////////// Update Place
////////////////////////////////////////////////////////////////

const updatePlaceById = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find(place => place.id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(place => place.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({
    message: "Success updated",
    place: updatedPlace
  });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter(place => place.id !== placeId);

  res.status(200).json({
    message: "Deleted place"
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlace = deletePlace;
