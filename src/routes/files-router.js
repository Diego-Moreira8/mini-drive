const { Router } = require("express");
const filesController = require("../controllers/files-controller");
const multer = require("../middlewares/multer");

const filesRouter = Router();

filesRouter.post("/enviar", multer.uploadFile, filesController.uploadFile);

//filesRouter.get("/arquivo/:id/baixar", filesController.downloadFile);

//filesRouter.get("/arquivo/:id/apagar", filesController.deleteFile);

module.exports = filesRouter;
