const { Router } = require("express");
const {
  checkUser,
  getDirectoryIfOwnedByUser,
} = require("../middlewares/custom-middlewares");
const directoriesController = require("../controllers/directories-controller");
const { validateDirectoryForm } = require("../middlewares/express-validator");

const directoriesRouter = Router();

directoriesRouter.use(checkUser);

directoriesRouter.get("/", directoriesController.getIndexPage);

directoriesRouter.post(
  "/:id/criar",
  getDirectoryIfOwnedByUser,
  directoriesController.postCreateDirectory
);

directoriesRouter.get(
  "/:id/renomear",
  getDirectoryIfOwnedByUser,
  directoriesController.getRenameDirectory
);

directoriesRouter.post(
  "/:id/renomear",
  getDirectoryIfOwnedByUser,
  validateDirectoryForm,
  directoriesController.postRenameDirectory
);

directoriesRouter.get(
  "/:id/apagar",
  getDirectoryIfOwnedByUser,
  directoriesController.promptDeleteDirectory
);

directoriesRouter.post(
  "/:id/apagar",
  getDirectoryIfOwnedByUser,
  directoriesController.postDeleteDirectory
);

directoriesRouter.get(
  "/:id",
  getDirectoryIfOwnedByUser,
  directoriesController.getDirectoryPage
);

module.exports = directoriesRouter;
