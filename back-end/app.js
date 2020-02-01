const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // for parsing application/json

///// => http://localhost:5000/api/places
app.use("/api/places", placeRoutes);

///// => http://localhost:5000/api/users
app.use("/api/users", usersRoutes);

////////////////////////////////////////////////////////////////
/////////////// Errors for Unsupported Routes
////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
  const error = new Error("Could not find this route", 404);
  throw error;
});

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
