const { Router } = require("express");
const indexController = require("../controllers/index-controller");
const { isUserDisconnected } = require("../middlewares/custom-middlewares");

const indexRouter = Router();

indexRouter.get("/", indexController.getIndex);
indexRouter.get("/inicio", isUserDisconnected, indexController.getHome);

module.exports = indexRouter;
