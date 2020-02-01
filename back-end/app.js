const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");

const app = express();

///// => http://localhost:5000/api/places
app.use("/api/places", placeRoutes);

////////////////////////////////////////////////////////////////
/////////////// ERROR
////////////////////////////////////////////////////////////////
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error ocurred" });
});

////////////////////////////////////////////////////////////////
/////////////// TO LISTEN TO => LOCALHOST
////////////////////////////////////////////////////////////////
app.listen(5000);
