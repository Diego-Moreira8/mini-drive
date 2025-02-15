const userProfileController = require("../controllers/user-profile-controller");
const {
  validateUpdateProfileForm,
} = require("../middlewares/express-validator");

const { Router } = require("express");

const userProfileRouter = Router();

userProfileRouter.get("/", userProfileController.getProfilePage);
userProfileRouter.post(
  "/editar-perfil",
  validateUpdateProfileForm,
  userProfileController.postProfileUpdate
);

module.exports = userProfileRouter;
