const { Router } = require("express");
const { authRouter } = require("./auth");
const { getHome } = require("../controllers");

const indexRouter = Router();

indexRouter.use("/", authRouter);

indexRouter.get("/", getHome);

module.exports = { indexRouter };
