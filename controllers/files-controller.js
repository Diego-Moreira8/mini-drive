const path = require("path");
const fileService = require("../services/file-service");

/** @type {import("express").RequestHandler} */
const uploadFile = async (req, res, next) => {
  await fileService.create(req.user.id, req.file);
  res.redirect("/");
};

/** @type {import("express").RequestHandler} */
const downloadFile = async (req, res, next) => {
  const fileId = parseInt(req.params.fileId);

  if (isNaN(fileId)) {
    return next({
      statusCode: 400,
      message: "O ID fornecido precisa ser um número.",
    });
  }

  const file = await fileService.getFileFromUser(fileId);

  if (!file) {
    return next({
      statusCode: 400,
      message: "Não existe um arquivo com o ID fornecido.",
    });
  }
  if (file.userId !== req.user.id) {
    return next({
      statusCode: 403,
      message: "Você não tem autorização para visualizar esse arquivo.",
    });
  }

  res.download(
    path.join(__dirname, `../uploads/${file.nameOnStorage}`),
    file.fileName
  );
};

module.exports = { uploadFile, downloadFile };
