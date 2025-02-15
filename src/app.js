require("dotenv").config();
const express = require("express");
const path = require("path");
const logger = require("morgan");
const { passport } = require("./authentication/passport");
const errorController = require("./controllers/error-controller");
const { configureSession } = require("./middlewares/express-session");
const { addUserToLocals } = require("./middlewares/custom-middlewares");
const indexRouter = require("./routes/index-router");
const authRouter = require("./routes/auth-router");
const userProfileRouter = require("./routes/user-profile-router");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(configureSession());
app.use(passport.session());
app.use(addUserToLocals);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/minha-conta", userProfileRouter);
// app.use("/pasta", filesRouter);

app.use(errorController.routeNotFound);
app.use(errorController.errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${listener.address().port}/`);
});
