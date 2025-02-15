const { Router } = require("express");
const indexController = require("../controllers/index-controller");

const indexRouter = Router();

indexRouter.get("/", indexController.getIndex);
indexRouter.get("/inicio", indexController.getHome);

module.exports = { indexRouter };
