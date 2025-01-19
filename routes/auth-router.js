const { Router } = require("express");
const authController = require("../controllers/auth-controller");
const { validateSignUpForm } = require("../middlewares/express-validator");

const authRouter = Router();

authRouter.get("/sign-up", authController.getSignUp);
authRouter.post("/sign-up", validateSignUpForm, authController.postSignUp);
authRouter.get("/log-in", authController.getLogin);
authRouter.post("/log-in", authController.postLogin);
authRouter.post("/log-out", authController.postLogout);

module.exports = { authRouter };
