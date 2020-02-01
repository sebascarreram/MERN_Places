const express = require("express");
const bodyParser = require("body-parser");

const placeRoutes = require("./routes/places-routes");

const app = express();

///// => http://localhost:5000/api/places
app.use("/api/places", placeRoutes);

app.listen(5000);
