const express = require("express");
const { check } = require("express-validator");

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
router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty(),
    // password must be at least 5 chars long
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  PlacesControllers.createPlace
);
//////////////////////////////
/////////////// Update place
router.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    // password must be at least 5 chars long
    check("description").isLength({ min: 5 })
  ],
  PlacesControllers.updatePlaceById
);
//////////////////////////////
/////////////// Delete place
router.delete("/:pid", PlacesControllers.deletePlace);

module.exports = router;
