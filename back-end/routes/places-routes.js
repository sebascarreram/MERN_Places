const express = require("express");

const PlacesControllers = require("../controllers/places-controllers");

const router = express.Router();

//////////////////////////////
/////////////// Get place by ID
router.get("/:pid", PlacesControllers.getPlaceById);
//////////////////////////////
/////////////// Get place by creator ID
router.get("/user/:uid", PlacesControllers.getPlacesByUserId);
//////////////////////////////
/////////////// Create place
router.post("/", PlacesControllers.createPlace);
//////////////////////////////
/////////////// Update place
router.patch("/:pid", PlacesControllers.updatePlaceById);
//////////////////////////////
/////////////// Delete place
router.delete("/:pid", PlacesControllers.deletePlace);

module.exports = router;
