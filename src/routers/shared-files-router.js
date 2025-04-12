const { Router } = require("express");
const sharedFilesController = require("../controllers/shared-files-controller");

const sharedFilesRouter = Router();

sharedFilesRouter.get("/:shareCode", sharedFilesController.getFilePage);
sharedFilesRouter.get("/:shareCode/baixar", sharedFilesController.downloadFile);

module.exports = sharedFilesRouter;
