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

  const queryResult = await fileService.getFileFromUser(req.user.id, fileId);

  if (!queryResult.success) {
    return next({
      statusCode: queryResult.statusCode,
      message: queryResult.message,
    });
  }

  res.download(
    path.join(__dirname, `../uploads/${queryResult.file.nameOnStorage}`),
    queryResult.file.fileName
  );
};

module.exports = { uploadFile, downloadFile };
