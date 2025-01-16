const { Router } = require("express");
const { getSignUp } = require("../controllers/auth");

const authRouter = Router();

authRouter.get("/sign-up", getSignUp);

module.exports = { authRouter };
