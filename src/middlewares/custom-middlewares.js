const folderService = require("../services/folder-service");
const fileService = require("../services/file-service");
const userService = require("../services/user-service");

/**
 * Attach user information to the response locals object for use
 * in views, without needing to retrieve it in each one separately.
 * @type {import("express").RequestHandler} */
const addUserToLocals = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { name, username } = req.user;

  const driveUsageBytes = await userService.getDriveUsage(req.user.id);

  const driveUsageMB =
    driveUsageBytes === 0 ? 0 : parseInt(driveUsageBytes / 1e6);

  const driveUsagePercentage =
    driveUsageBytes === 0
      ? 0
      : parseInt((driveUsageBytes / parseInt(process.env.UPLOAD_LIMIT)) * 100);

  res.locals = {
    ...res.locals,
    user: { name, username },
    driveUsageBytes,
    driveUsageMB,
    driveUsagePercentage,
  };

  next();
};

/**
 * Attach the current path to the response locals object for use
 * in the nav view.
 * @type {import("express").RequestHandler} */
const addCurrentPathToLocals = (req, res, next) => {
  res.locals.path = req.originalUrl;
  next();
};

/** @type {import("express").RequestHandler} */
const isUserConnected = (req, res, next) => {
  if (!req.user) {
    return res.status(403).redirect("/");
  }
  next();
};

/** @type {import("express").RequestHandler} */
const isUserDisconnected = (req, res, next) => {
  if (req.user) {
    return res.status(403).redirect("/");
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
        msgForUser: "A pasta requisitada não existe.",
      };
    }

    if (req.user.id !== folder.ownerId) {
      throw {
        statusCode: 403,
        msgForUser: "Você não tem permissão para acessar esta pasta.",
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
  addCurrentPathToLocals,
  isUserConnected,
  isUserDisconnected,
  getFolderIfOwnedByUser,
  getFileIfOwnedByUser,
};
