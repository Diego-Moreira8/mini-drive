const { Router } = require("express");
const multer = require("../middlewares/multer");
const { checkUser } = require("../middlewares/custom-middlewares");
const directoriesController = require("../controllers/directories-controller");

const directoriesRouter = Router();

directoriesRouter.use(checkUser);

directoriesRouter.get("/", directoriesController.getIndexPage);
directoriesRouter.get("/:id", directoriesController.getDirectoryPage);

// filesRouter.get("/meus-arquivos", filesController.getRoot);
// filesRouter.post(
//   "/enviar-arquivo",
//   multer.uploadFile,
//   filesController.uploadFile
// );
// filesRouter.get("/arquivo/baixar/:fileId", filesController.downloadFile);
// filesRouter.get("/arquivo/apagar/:fileId", filesController.deleteFile);

// filesRouter.post("/criar-diretorio", filesController.newDirectory);

module.exports = directoriesRouter;
