const path = require("path");
const multer = require("multer");

const uploadSingleFile = multer({
  dest: path.join(__dirname, `../../multer-uploads/`),
  limits: { fileSize: 25000000 /*25 MB*/ },
}).single("file");

/** @type {import("express").RequestHandler} */
const uploadFile = (req, res, next) => {
  if (!req.user) {
    throw {
      statusCode: 401,
      message: "Para enviar um arquivo um usuário precisa estar conectado.",
    };
  }

  uploadSingleFile(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return next({
        statusCode: 400,
        message: "Tamanho máximo de arquivo excedido.",
      });
    } else if (err) {
      return next({
        message: "Houve um erro ao enviar o arquivo.",
      });
    }

    next();
  });
};

module.exports = { uploadFile };
