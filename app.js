require("dotenv").config();
const express = require("express");
const path = require("path");
const { indexRouter } = require("./routes/index-router");
const errorController = require("./controllers/error-controller");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);

app.use(errorController.routeNotFound);
app.use(errorController.errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${listener.address().port}/`);
});
