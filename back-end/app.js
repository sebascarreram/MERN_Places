const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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
/////////////// MONGOOSE AND TO LISTEN TO => LOCALHOST
////////////////////////////////////////////////////////////////
const password = "Jp2KUmyewjdK2ZZF";
const nameDatabase = "placesDB";
mongoose
  .connect(
    `mongodb+srv://Sebastian:${password}@cluster0-prdrv.mongodb.net/${nameDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(5000);
    console.log("Connected to DB successfully 🎉");
  })
  .catch(error => {
    console.log(error);
  });
