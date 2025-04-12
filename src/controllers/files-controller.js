const fileService = require("../services/file-service");
const splitFileName = require("../utils/split-file-name");

const getRenameFileFormView = (fileName, errorsArray, value) => {
  return {
    template: "pages/content-form-page",
    isRename: true,
    title: `Renomear arquivo "${fileName}"`,
    errors: errorsArray || [],
    value: value || "",
  };
};

/** @type {import("express").RequestHandler} */
const getFileDetails = (req, res, next) => {
  res.render("layout", {
    template: "pages/file-details-page",
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
  } catch (error) {
    next(error);
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
  } catch (error) {
    return next(error);
  }
};

/** @type {import("express").RequestHandler} */
const promptDeleteFile = (req, res, next) => {
  res.render("layout", {
    template: "pages/delete-prompt-page",
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
      return res.redirect(`/arquivo/${id}`);
    }

    await fileService.deleteFile(id);
    res.redirect(`/pasta/${folderId}`);
  } catch (error) {
    return next(error);
  }
};

/** @type {import("express").RequestHandler} */
const getRenameFile = (req, res, next) => {
  const { fileName } = res.locals.file;
  const { baseName } = splitFileName(fileName);
  res.render("layout", getRenameFileFormView(fileName, [], baseName));
};

/** @type {import("express").RequestHandler} */
const postRenameFile = async (req, res, next) => {
  try {
    const { fileName, folderId } = res.locals.file;
    const { baseName, extension } = splitFileName(fileName);
    const newName = req.body.name;
    const newNameWithExtension = newName + "." + extension;
    const nameChanged = newName !== baseName;

    if (!nameChanged) {
      return res.redirect(`/arquivo/${res.locals.file.id}`);
    }

    const nameTaken = await fileService.checkDuplication(
      folderId,
      newNameWithExtension
    );

    if (nameTaken) {
      res.locals.formErrors.push({ msg: "Já existe um arquivo com este nome" });
    }

    if (res.locals.formErrors.length > 0) {
      return res
        .status(400)
        .render(
          "layout",
          getRenameFileFormView(fileName, res.locals.formErrors, newName)
        );
    }

    await fileService.rename(res.locals.file.id, newNameWithExtension);

    res.redirect(`/arquivo/${res.locals.file.id}`);
  } catch (error) {
    return next(error);
  }
};

/** @type {import("express").RequestHandler} */
const toggleShareFile = async (req, res, next) => {
  try {
    const { id, shareCode } = res.locals.file;
    if (shareCode) {
      await fileService.stopShare(id);
    } else {
      await fileService.share(id);
    }

    res.redirect(`/arquivo/${id}`);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getFileDetails,
  uploadFile,
  downloadFile,
  promptDeleteFile,
  postDeleteFile,
  getRenameFile,
  postRenameFile,
  toggleShareFile,
};
