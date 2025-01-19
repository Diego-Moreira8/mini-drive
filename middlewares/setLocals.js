/**
 * Middleware to attach user information to the response locals object for use
 * in views, without needing to retrieve it in each one separately.
 * @type {import("express").RequestHandler} */
const addUser = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const { name, username } = req.user;
  res.locals = { user: { name, username } };
  next();
};

module.exports = { addUser };
