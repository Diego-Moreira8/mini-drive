const { Router } = require("express");
const { authRouter } = require("./auth-router");
const { filesRouter } = require("./files-router");
const indexController = require("../controllers/index-controller");
const {
  validateUpdateProfileForm,
} = require("../middlewares/express-validator");

const indexRouter = Router();

indexRouter.get("/", indexController.getHome);
indexRouter.get("/minha-conta", indexController.getProfilePage);
indexRouter.post(
  "/minha-conta",
  validateUpdateProfileForm,
  indexController.postProfileUpdate
);

module.exports = { indexRouter };
