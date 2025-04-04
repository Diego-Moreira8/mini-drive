const fileService = require("../services/file-service");

/** @type {import("express").RequestHandler} */
const getFileDetails = (req, res, next) => {
  res.render("layout", {
    template: "pages/file-details",
    title: "Detalhes do Arquivo",
    file: res.locals.file,
  });
};

/** @type {import("express").RequestHandler} */
const uploadFile = async (req, res, next) => {
  try {
    const reloadFolder = () => res.redirect(`/pasta/${req.body.folderId}`);

    if (!req.file) {
      return reloadFolder();
    }

    await fileService.create(
      req.user.id,
      parseInt(req.body.folderId),
      req.file.originalname,
      req.file.size,
      req.file.mimetype,
      req.file.buffer
    );

    return reloadFolder();
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const downloadFile = async (req, res, next) => {
  try {
    const { nameOnStorage, fileName } = res.locals.file;
    const signedUrl = await fileService.getSignedUrl(
      req.user.id,
      nameOnStorage,
      fileName
    );
    res.redirect(signedUrl);
  } catch (err) {
    return next(err);
  }
};

/** @type {import("express").RequestHandler} */
const promptDeleteFile = (req, res, next) => {
  res.render("layout", {
    template: "pages/prompt",
    title: "Apagar Arquivo",
    promptTitle: "Apagar Arquivo",
    promptText: `Tem certeza que deseja apagar o arquivo "${res.locals.file.fileName}"?`,
    action: `/arquivo/${res.locals.file.id}/apagar`,
  });
};

/** @type {import("express").RequestHandler} */
const postDeleteFile = async (req, res, next) => {
  try {
    const { id, folderId } = res.locals.file;
    const deleteConfirmed = req.body.response === "true";

    if (!deleteConfirmed) {
      return res.redirect(`/pasta/${folderId}`);
    }

    await fileService.deleteFile(id);
    res.redirect(`/pasta/${folderId}`);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getFileDetails,
  uploadFile,
  downloadFile,
  promptDeleteFile,
  postDeleteFile,
};
