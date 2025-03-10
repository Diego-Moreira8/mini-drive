const fileService = require("../services/file-service");
const path = require("path");
const fs = require("fs/promises");

/** @type {import("express").RequestHandler} */
const uploadFile = async (req, res, next) => {
  try {
    const reloadDirectory = () =>
      res.redirect(`/pasta/${req.body.directoryId}`);

    if (!req.file) {
      return reloadDirectory();
    }

    await fileService.create(
      req.user.id,
      parseInt(req.body.directoryId),
      req.file.originalname,
      req.file.filename,
      req.file.size,
      req.file.mimetype
    );

    return reloadDirectory();
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const downloadFile = async (req, res, next) => {
  try {
    const { nameOnStorage, fileName } = res.locals.file;
    res.download(
      path.join(__dirname, `../../multer-uploads/${nameOnStorage}`),
      fileName
    );
  } catch (err) {
    return next(err);
  }
};

/** @type {import("express").RequestHandler} */
const deleteFile = async (req, res, next) => {
  try {
    const { id, nameOnStorage, directoryId } = res.locals.file;
    await fs.unlink(
      path.join(__dirname, `../../multer-uploads/${nameOnStorage}`)
    );
    await fileService.deleteFile(id);
    res.redirect(`/pasta/${directoryId}`);
  } catch (err) {
    return next(err);
  }
};

const filesController = {
  uploadFile,
  downloadFile,
  deleteFile,
};

module.exports = filesController;
