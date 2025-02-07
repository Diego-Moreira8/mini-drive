const { Router } = require("express");
const multer = require("../middlewares/multer");
const filesController = require("../controllers/files-controller");

const filesRouter = Router();

filesRouter.post(
  "/enviar-arquivo",
  multer.uploadFile,
  filesController.uploadFile
);
filesRouter.get("/arquivo/baixar/:fileId", filesController.downloadFile);

module.exports = { filesRouter };
