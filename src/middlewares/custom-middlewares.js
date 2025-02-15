const directoryService = require("../services/directory-service");

/**
 * Middleware to attach user information to the response locals object for use
 * in views, without needing to retrieve it in each one separately.
 * @type {import("express").RequestHandler} */
const addUserToLocals = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { name, username } = req.user;
  res.locals = {
    ...res.locals,
    user: { name, username },
  };
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
const getDirectoryIfOwnedByUser = async (req, res, next) => {
  try {
    const directory = await directoryService.getById(parseInt(req.params.id));

    if (!directory) {
      throw {
        statusCode: 404,
        msgForUser: "O diretório requisitado não existe.",
      };
    }

    if (req.user.id !== directory.ownerId) {
      throw {
        statusCode: 403,
        msgForUser: "Você não tem permissão para acessar este diretório.",
      };
    }

    res.locals = { ...res.locals, directory };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { addUserToLocals, checkUser, getDirectoryIfOwnedByUser };
