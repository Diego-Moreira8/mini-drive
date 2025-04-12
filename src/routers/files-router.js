const { Router } = require("express");
const { getFileIfOwnedByUser } = require("../middlewares/custom-middlewares");
const filesController = require("../controllers/files-controller");
const uploadSingleFile = require("../middlewares/multer");
const { validateContentForm } = require("../middlewares/express-validator");

const filesRouter = Router();

filesRouter.post("/enviar", uploadSingleFile, filesController.uploadFile);

filesRouter.get(
  "/:id/baixar",
  getFileIfOwnedByUser,
  filesController.downloadFile
);

filesRouter.get(
  "/:id/apagar",
  getFileIfOwnedByUser,
  filesController.promptDeleteFile
);

filesRouter.post(
  "/:id/apagar",
  getFileIfOwnedByUser,
  filesController.postDeleteFile
);

filesRouter.get(
  "/:id/renomear",
  getFileIfOwnedByUser,
  filesController.getRenameFile
);

filesRouter.post(
  "/:id/renomear",
  getFileIfOwnedByUser,
  validateContentForm,
  filesController.postRenameFile
);

filesRouter.get("/:id", getFileIfOwnedByUser, filesController.getFileDetails);

module.exports = filesRouter;
