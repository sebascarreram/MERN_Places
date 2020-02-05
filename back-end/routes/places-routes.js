const express = require("express");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controllers");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

//////////////////////////////
/////////////// Get place by ID
router.get("/:pid", placesControllers.getPlaceById);
//////////////////////////////
/////////////// Get place by creator ID
router.get("/user/:uid", placesControllers.getPlacesByUserId);
//////////////////////////////
/////////////// Create place
router.post(
  "/",
  fileUpload.single("image"),
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
  placesControllers.createPlace
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
  placesControllers.updatePlaceById
);
//////////////////////////////
/////////////// Delete place
router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
