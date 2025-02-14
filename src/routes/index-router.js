const { Router } = require("express");
const indexController = require("../controllers/index-controller");

const indexRouter = Router();

indexRouter.get("/", indexController.getIndex);

module.exports = { indexRouter };
