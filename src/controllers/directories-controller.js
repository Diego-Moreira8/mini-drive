const directoryService = require("../services/directory-service");

/** @type {import("express").RequestHandler} */
const getIndexPage = async (req, res, next) => {
  try {
    const rootDirectory = await directoryService.getUserRoot(req.user.id);
    res.redirect(`/pasta/${rootDirectory.id}`);
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const getDirectoryPage = async (req, res, next) => {
  res.render("layout", {
    template: "pages/files-table",
    directory: res.locals.directory,
  });
};

/** @type {import("express").RequestHandler} */
const postCreateDirectory = async (req, res, next) => {
  try {
    const newDirectory = await directoryService.create(
      req.body.name,
      req.user.id,
      parseInt(req.params.id)
    );
    res.redirect(`/pasta/${newDirectory.id}`);
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const getRenameDirectory = (req, res, next) => {
  res.render("layout", {
    template: "pages/directory-form",
    isEdit: true,
    title: `Renomear pasta ${res.locals.directory.name}`,
    errors: [],
  });
};

/** @type {import("express").RequestHandler} */
const postRenameDirectory = async (req, res, next) => {
  try {
    const nameTaken = await directoryService.getByName(
      req.body.name,
      res.locals.directory.parentId
    );
    if (nameTaken) {
      res.locals.formErrors.push({ msg: "Já existe uma pasta com este nome" });
    }

    if (res.locals.formErrors.length > 0) {
      return res.status(400).render("layout", {
        template: "pages/directory-form",
        isEdit: true,
        title: `Renomear pasta ${res.locals.directory.name}`,
        errors: res.locals.formErrors,
      });
    }

    await directoryService.renameDirectory(
      res.locals.directory.id,
      req.body.name
    );
    res.redirect(`/pasta/${res.locals.directory.id}`);
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const promptDeleteDirectory = (req, res, next) => {
  res.render("layout", {
    template: "pages/prompt",
    promptTitle: `Apagar Diretório ${res.locals.directory.name}`,
    promptText:
      "Tem certeza que deseja apagar o diretório e todos os seus arquivos?",
    action: `/pasta/${res.locals.directory.id}/apagar`,
  });
};

/** @type {import("express").RequestHandler} */
const postDeleteDirectory = async (req, res, next) => {
  try {
    const deleteConfirmed = req.body.response === "true";

    if (!deleteConfirmed) {
      console.log("hi");
      return res.redirect(`/pasta/${res.locals.directory.id}`);
    }

    await directoryService.deleteDirectoryAndItsFiles(res.locals.directory.id);
    res.redirect(`/pasta/${res.locals.directory.parentId}`);
  } catch (err) {
    next(err);
  }
};

const directoriesController = {
  getIndexPage,
  getDirectoryPage,
  postCreateDirectory,
  getRenameDirectory,
  postRenameDirectory,
  promptDeleteDirectory,
  postDeleteDirectory,
};
module.exports = directoriesController;
