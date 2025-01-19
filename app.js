require("dotenv").config();
const express = require("express");
const path = require("path");
const { passport } = require("./authentication/passport");
const errorController = require("./controllers/error-controller");
const { configureSession } = require("./middlewares/express-session");
const setLocals = require("./middlewares/setLocals");
const { indexRouter } = require("./routes/index-router");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(configureSession());
app.use(passport.session());
app.use(setLocals.addUser);

app.use("/", indexRouter);

app.use(errorController.routeNotFound);
app.use(errorController.errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${listener.address().port}/`);
});
