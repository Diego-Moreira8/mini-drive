const { Router } = require("express");
const authController = require("../controllers/auth-controller");
const { validateSignUpForm } = require("../middlewares/express-validator");

const authRouter = Router();

authRouter.get("/sign-up", authController.getSignUp);
authRouter.post("/sign-up", validateSignUpForm, authController.postSignUp);

module.exports = { authRouter };
