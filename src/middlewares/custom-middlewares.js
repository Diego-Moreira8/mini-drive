/**
 * Middleware to attach user information to the response locals object for use
 * in views, without needing to retrieve it in each one separately.
 * @type {import("express").RequestHandler} */
const addUserToLocals = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { name, username } = req.user;
  res.locals = { user: { name, username } };
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

module.exports = { addUserToLocals, checkUser };
