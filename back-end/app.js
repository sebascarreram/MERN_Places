const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placeRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // for parsing application/json

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// CORS Headers => Required for cross-origin/ cross-server communication
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

///// => http://localhost:5000/api/places
app.use("/api/places", placeRoutes);

///// => http://localhost:5000/api/users
app.use("/api/users", usersRoutes);

////////////////////////////////////////////////////////////////
/////////////// Errors for Unsupported Routes
////////////////////////////////////////////////////////////////
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

////////////////////////////////////////////////////////////////
/////////////// ERROR
////////////////////////////////////////////////////////////////
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

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
const nameDatabase = "mern";
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
