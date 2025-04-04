const folderService = require("../services/folder-service");
const fileService = require("../services/file-service");

/**
 * Middleware to attach user information to the response locals object for use
 * in views, without needing to retrieve it in each one separately.
 * @type {import("express").RequestHandler} */
const addUserToLocals = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { name, username } = req.user;
  res.locals.user = { name, username };
  next();
};

/** @type {import("express").RequestHandler} */
const checkUser = (req, res, next) => {
  if (!req.user) {
    return next({
      statusCode: 401,
      msgForUser: "Você precisa estar conectado para acessar este recurso.",
    });
  }
  next();
};

/** @type {import("express").RequestHandler} */
const getFolderIfOwnedByUser = async (req, res, next) => {
  try {
    const folder = await folderService.getById(parseInt(req.params.id));

    if (!folder) {
      throw {
        statusCode: 404,
        msgForUser: "O diretório requisitado não existe.",
      };
    }

    if (req.user.id !== folder.ownerId) {
      throw {
        statusCode: 403,
        msgForUser: "Você não tem permissão para acessar este diretório.",
      };
    }

    res.locals = { ...res.locals, folder };

    next();
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler} */
const getFileIfOwnedByUser = async (req, res, next) => {
  try {
    const file = await fileService.getById(parseInt(req.params.id));

    if (!file) {
      throw {
        statusCode: 404,
        msgForUser: "O arquivo requisitado não existe.",
      };
    }

    if (req.user.id !== file.ownerId) {
      throw {
        statusCode: 403,
        msgForUser: "Você não tem permissão para acessar este arquivo.",
      };
    }

    res.locals = { ...res.locals, file };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addUserToLocals,
  checkUser,
  getFolderIfOwnedByUser,
  getFileIfOwnedByUser,
};
