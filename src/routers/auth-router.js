const { Router } = require("express");
const authController = require("../controllers/auth-controller");
const { validateSignUpForm } = require("../middlewares/express-validator");
const {
  isUserConnected,
  isUserDisconnected,
} = require("../middlewares/custom-middlewares");

const authRouter = Router();

authRouter.get("/criar-conta", isUserDisconnected, authController.getSignUp);
authRouter.post(
  "/criar-conta",
  isUserDisconnected,
  validateSignUpForm,
  authController.postSignUp
);

authRouter.get("/entrar", isUserDisconnected, authController.getLogin);
authRouter.post("/entrar", isUserDisconnected, authController.postLogin);

authRouter.get("/sair", isUserConnected, authController.getLogout);

module.exports = authRouter;
