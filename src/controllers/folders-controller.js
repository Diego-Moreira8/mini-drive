const folderService = require("../services/folder-service");
const hierarchizeFolders = require("../utils/hierarchize-folders");

const getCreateFolderFormView = (errorsArray, value) => {
  return {
    template: "pages/folder-form",
    isEdit: false,
    title: "Criar pasta",
    errors: errorsArray || [],
    value: value || "",
  };
};

const getRenameFolderFormView = (folderName, errorsArray, value) => {
  return {
    template: "pages/folder-form",
    isEdit: true,
    title: `Renomear pasta ${folderName}`,
    errors: errorsArray || [],
    value: value || "",
  };
};

/** @type {import("express").RequestHandler} */
const getIndexPage = async (req, res, next) => {
  try {
    const rootFolder = await folderService.getUserRoot(req.user.id);
    res.redirect(`/pasta/${rootFolder.id}`);
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler} */
const getFolderPage = async (req, res, next) => {
  const allFolders = hierarchizeFolders(
    await folderService.getUserFolders(req.user.id)
  );

  res.render("layout", {
    template: "pages/file-explorer",
    folder: res.locals.folder,
    allFolders,
  });
};

/** @type {import("express").RequestHandler} */
const getCreateFolder = async (req, res, next) => {
  res.render("layout", getCreateFolderFormView());
};

/** @type {import("express").RequestHandler} */
const postCreateFolder = async (req, res, next) => {
  try {
    const nameTaken = await folderService.getByName(
      req.body.name,
      res.locals.folder.id
    );
    if (nameTaken) {
      res.locals.formErrors.push({ msg: "Já existe uma pasta com este nome" });
    }

    if (res.locals.formErrors.length > 0) {
      return res
        .status(400)
        .render(
          "layout",
          getCreateFolderFormView(res.locals.formErrors, req.body.name)
        );
    }

    const newFolder = await folderService.create(
      req.body.name,
      req.user.id,
      parseInt(req.params.id)
    );
    res.redirect(`/pasta/${newFolder.id}`);
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler} */
const getRenameFolder = (req, res, next) => {
  const currDirName = res.locals.folder.name;
  res.render("layout", getRenameFolderFormView(currDirName, [], currDirName));
};

/** @type {import("express").RequestHandler} */
const postRenameFolder = async (req, res, next) => {
  try {
    const nameNotChanged = res.locals.folder.name === req.body.name;
    if (nameNotChanged) {
      return res.redirect(`/pasta/${res.locals.folder.id}`);
    }

    const nameTaken = await folderService.getByName(
      req.body.name,
      res.locals.folder.parentId
    );
    if (nameTaken) {
      res.locals.formErrors.push({ msg: "Já existe uma pasta com este nome" });
    }

    if (res.locals.formErrors.length > 0) {
      return res
        .status(400)
        .render(
          "layout",
          getRenameFolderFormView(
            res.locals.folder.name,
            res.locals.formErrors,
            req.body.name
          )
        );
    }

    await folderService.renameFolder(res.locals.folder.id, req.body.name);
    res.redirect(`/pasta/${res.locals.folder.id}`);
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler} */
const promptDeleteFolder = (req, res, next) => {
  res.render("layout", {
    template: "pages/prompt",
    title: "Apagar Diretório",
    promptTitle: "Apagar Diretório",
    promptText: `Tem certeza que deseja apagar o diretório "${res.locals.folder.name}" e todos os seus arquivos?`,
    action: `/pasta/${res.locals.folder.id}/apagar`,
  });
};

/** @type {import("express").RequestHandler} */
const postDeleteFolder = async (req, res, next) => {
  try {
    const deleteConfirmed = req.body.response === "true";

    if (!deleteConfirmed) {
      return res.redirect(`/pasta/${res.locals.folder.id}`);
    }

    await folderService.deleteFolderAndItsFiles(res.locals.folder.id);
    res.redirect(`/pasta/${res.locals.folder.parentId}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndexPage,
  getFolderPage,
  getCreateFolder,
  postCreateFolder,
  getRenameFolder,
  postRenameFolder,
  promptDeleteFolder,
  postDeleteFolder,
};
