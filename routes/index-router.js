const { Router } = require("express");
const { authRouter } = require("./auth-router");
const indexController = require("../controllers/index-controller");

const indexRouter = Router();

indexRouter.use("/", authRouter);

indexRouter.get("/", indexController.getHome);
indexRouter.get("/minha-conta", indexController.getProfilePage);

module.exports = { indexRouter };
