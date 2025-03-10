const fileService = require("../services/file-service");
const path = require("path");

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
    const id = validateId(req.params.fileId);
    const file = await fileService.getFile(id);
    checkFilePermissions(file, req.user.id);
    const deletedFile = await fileService.deleteFile(id);

    // Delete from uploads directory
    unlink(
      path.join(__dirname, `../../uploads/${deletedFile.nameOnStorage}`),
      (err) => {
        if (err) throw err;
      }
    );

    res.redirect("/");
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
