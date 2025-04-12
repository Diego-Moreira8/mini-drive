require("dotenv").config();
const folderService = require("../services/folder-service");
const hierarchizeFolders = require("../utils/hierarchize-folders");

const getCreateFolderFormView = (errorsArray, value) => {
  return {
    template: "pages/content-form-page",
    isRename: false,
    title: "Criar pasta",
    errors: errorsArray || [],
    value: value || "",
  };
};

const getRenameFolderFormView = (folderName, errorsArray, value) => {
  return {
    template: "pages/content-form-page",
    isRename: true,
    title: `Renomear pasta "${folderName}"`,
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
  const currentFolder = res.locals.folder;

  const title = currentFolder.rootOfUserId
    ? "Meus Arquivos"
    : `Pasta: ${currentFolder.name}`;

  const allFolders = await folderService.getUserFolders(req.user.id);

  const hierarchicalFolders = hierarchizeFolders(allFolders);

  res.render("layout", {
    template: "pages/folder-page",
    title,
    currentFolder,
    allFolders,
    hierarchicalFolders,
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
  if (res.locals.folder.rootOfUserId) {
    return res.status(403).redirect("/");
  }

  const currFolderName = res.locals.folder.name;
  res.render(
    "layout",
    getRenameFolderFormView(currFolderName, [], currFolderName)
  );
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
  if (res.locals.folder.rootOfUserId) {
    return res.status(403).redirect("/");
  }

  res.render("layout", {
    template: "pages/delete-prompt-page",
    title: "Apagar Pasta",
    promptTitle: "Apagar Pasta",
    promptText: `Tem certeza que deseja apagar a pasta "${res.locals.folder.name}" e todos os seus arquivos?`,
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
