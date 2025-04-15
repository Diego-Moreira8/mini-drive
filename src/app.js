require("dotenv").config();
require("./utils/check-env-vars")([
  "NODE_ENV",
  "SESSION_COOKIE_SECRET",
  "DATABASE_URL",
  "SUPABASE_SECRET",
  "SUPABASE_PROJECT_URL",
  "UPLOAD_LIMIT",
]);
const { NODE_ENV, PORT } = process.env;

// Packages
const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const { default: helmet } = require("helmet");
const compression = require("compression");
const logger = require("morgan");
// Configs
const passport = require("./config/passport");
const expressSessionOptions = require("./config/express-session");
const expressStatic = require("./config/express-static");
// Routers
const indexRouter = require("./routers/index-router");
const authRouter = require("./routers/auth-router");
const userProfileRouter = require("./routers/user-profile-router");
const foldersRouter = require("./routers/folders-router");
const filesRouter = require("./routers/files-router");
const sharedFilesRouter = require("./routers/shared-files-router");
// Controllers
const errorController = require("./controllers/error-controller");
// Middlewares
const {
  addUserToLocals,
  isUserConnected,
  addCurrentPathToLocals,
} = require("./middlewares/custom-middlewares");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

if (NODE_ENV !== "production") {
  app.use(logger("dev"));
}
app.use(helmet());
app.use(compression());
app.use(express.static(expressStatic.root, expressStatic.options));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession(expressSessionOptions));
app.use(passport.session());
app.use(addUserToLocals, addCurrentPathToLocals);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/minha-conta", isUserConnected, userProfileRouter);
app.use("/pasta", isUserConnected, foldersRouter);
app.use("/arquivo", isUserConnected, filesRouter);
app.use("/s", sharedFilesRouter);

app.use(errorController.routeNotFound);
app.use(errorController.errorHandler);

const listener = app.listen(PORT || 3000, () => {
  console.log(
    `Listening on http://localhost:${listener.address().port}/ (${NODE_ENV})`
  );
});
