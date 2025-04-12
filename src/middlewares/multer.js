require("dotenv").config();
const multer = require("multer");

const UPLOAD_LIMIT = parseInt(process.env.UPLOAD_LIMIT);

const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: UPLOAD_LIMIT },
}).single("file");

/** @type {import("express").RequestHandler} */
const uploadSingleFile = (req, res, next) => {
  uploadSingle(req, res, (error) => {
    const noSpaceForFile =
      req.file?.size > UPLOAD_LIMIT - res.locals.driveUsageBytes;

    if (
      error instanceof multer.MulterError &&
      error.code === "LIMIT_FILE_SIZE"
    ) {
      return next({
        statusCode: 400,
        msgForUser: "Tamanho máximo de arquivo excedido.",
      });
    } else if (noSpaceForFile) {
      return next({
        statusCode: 400,
        msgForUser: "Não espaço suficiente para este arquivo!",
      });
    } else if (error) {
      return next({
        msgForUser: "Houve um erro ao enviar o arquivo.",
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
