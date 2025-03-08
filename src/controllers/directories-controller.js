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
  const deleteConfirmed = req.body.response === "true";

  if (!deleteConfirmed) {
    console.log("hi");
    return res.redirect(`/pasta/${res.locals.directory.id}`);
  }

  await directoryService.deleteDirectoryAndItsFiles(res.locals.directory.id);
  res.redirect(`/pasta/${res.locals.directory.parentId}`);
};

const directoriesController = {
  getIndexPage,
  getDirectoryPage,
  postCreateDirectory,
  promptDeleteDirectory,
  postDeleteDirectory,
};
module.exports = directoriesController;
