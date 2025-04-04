require("dotenv").config();
const multer = require("multer");

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.UPLOAD_LIMIT) },
}).single("file");

/** @type {import("express").RequestHandler} */
const uploadSingleFile = (req, res, next) => {
  uploadSingle(req, res, (error) => {
    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return next({
        statusCode: 400,
        message: "Tamanho máximo de arquivo excedido.",
      });
    } else if (error) {
      return next({
        message: "Houve um erro ao enviar o arquivo.",
      });
    }

    // Fix issue with accented characters
    req.file.originalname = Buffer.from(
      req.file.originalname,
      "latin1"
    ).toString("utf8");

    next();
  });
};

module.exports = uploadSingleFile;
