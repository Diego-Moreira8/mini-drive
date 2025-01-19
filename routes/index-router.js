const { Router } = require("express");
const { authRouter } = require("./auth-router");
const { getHome } = require("../controllers/index-controller");

const indexRouter = Router();

indexRouter.use("/", authRouter);

indexRouter.get("/", getHome);

module.exports = { indexRouter };
