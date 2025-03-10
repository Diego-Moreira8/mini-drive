const { Router } = require("express");
const {
  getFileIfOwnedByUser,
  checkUser,
} = require("../middlewares/custom-middlewares");
const filesController = require("../controllers/files-controller");
const multer = require("../middlewares/multer");

const filesRouter = Router();

filesRouter.use(checkUser);

filesRouter.post("/enviar", multer.uploadFile, filesController.uploadFile);

filesRouter.get(
  "/:id/baixar",
  getFileIfOwnedByUser,
  filesController.downloadFile
);

filesRouter.get(
  "/:id/apagar",
  getFileIfOwnedByUser,
  filesController.deleteFile
);

module.exports = filesRouter;
