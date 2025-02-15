const { Router } = require("express");
const authController = require("../controllers/auth-controller");
const { validateSignUpForm } = require("../middlewares/express-validator");

const authRouter = Router();

authRouter.get("/registrar", authController.getSignUp);
authRouter.post("/registrar", validateSignUpForm, authController.postSignUp);

authRouter.get("/entrar", authController.getLogin);
authRouter.post("/entrar", authController.postLogin);

authRouter.get("/sair", authController.getLogout);

module.exports = authRouter;
