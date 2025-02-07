const { Router } = require("express");
const multer = require("../middlewares/multer");
const filesController = require("../controllers/files-controller");
const { checkUser } = require("../middlewares/custom-middlewares");

const filesRouter = Router();

filesRouter.use(checkUser);

filesRouter.post(
  "/enviar-arquivo",
  multer.uploadFile,
  filesController.uploadFile
);
filesRouter.get("/arquivo/baixar/:fileId", filesController.downloadFile);

module.exports = { filesRouter };
