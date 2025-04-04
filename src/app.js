// Packages
require("dotenv").config();
const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const logger = require("morgan");
// Configs
const passport = require("./config/passport");
const expressSessionOptions = require("./config/express-session");
// Routers
const indexRouter = require("./routers/index-router");
const authRouter = require("./routers/auth-router");
const userProfileRouter = require("./routers/user-profile-router");
const foldersRouter = require("./routers/folders-router");
const filesRouter = require("./routers/files-router");
// Controllers
const errorController = require("./controllers/error-controller");
// Middlewares
const { addUserToLocals } = require("./middlewares/custom-middlewares");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession(expressSessionOptions));
app.use(passport.session());
app.use(addUserToLocals);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/minha-conta", userProfileRouter);
app.use("/pasta", foldersRouter);
app.use("/arquivo", filesRouter);

app.use(errorController.routeNotFound);
app.use(errorController.errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on http://localhost:${listener.address().port}/`);
});
