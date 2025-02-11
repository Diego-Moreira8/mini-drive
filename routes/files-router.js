const { Router } = require("express");
const multer = require("../middlewares/multer");
const filesController = require("../controllers/files-controller");
const { checkUser } = require("../middlewares/custom-middlewares");

const filesRouter = Router();

filesRouter.use(checkUser);

filesRouter.get("/meus-arquivos", filesController.getRoot);
filesRouter.post(
  "/enviar-arquivo",
  multer.uploadFile,
  filesController.uploadFile
);
filesRouter.get("/arquivo/baixar/:fileId", filesController.downloadFile);
filesRouter.get("/arquivo/apagar/:fileId", filesController.deleteFile);

filesRouter.post("/criar-diretorio", filesController.newDirectory);

module.exports = { filesRouter };
