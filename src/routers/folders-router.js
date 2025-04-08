const { Router } = require("express");
const { getFolderIfOwnedByUser } = require("../middlewares/custom-middlewares");
const foldersController = require("../controllers/folders-controller");
const { validateFolderForm } = require("../middlewares/express-validator");

const foldersRouter = Router();

foldersRouter.get("/", foldersController.getIndexPage);

foldersRouter.get(
  "/:id/criar",
  getFolderIfOwnedByUser,
  foldersController.getCreateFolder
);

foldersRouter.post(
  "/:id/criar",
  getFolderIfOwnedByUser,
  validateFolderForm,
  foldersController.postCreateFolder
);

foldersRouter.get(
  "/:id/renomear",
  getFolderIfOwnedByUser,
  foldersController.getRenameFolder
);

foldersRouter.post(
  "/:id/renomear",
  getFolderIfOwnedByUser,
  validateFolderForm,
  foldersController.postRenameFolder
);

foldersRouter.get(
  "/:id/apagar",
  getFolderIfOwnedByUser,
  foldersController.promptDeleteFolder
);

foldersRouter.post(
  "/:id/apagar",
  getFolderIfOwnedByUser,
  foldersController.postDeleteFolder
);

foldersRouter.get(
  "/:id",
  getFolderIfOwnedByUser,
  foldersController.getFolderPage
);

module.exports = foldersRouter;
