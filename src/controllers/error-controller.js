require("dotenv").config();

/** @type {import("express").RequestHandler} */
const routeNotFound = (req, res, next) => {
  throw { statusCode: 404, msgForUser: "Página não encontrada." };
};

/** @type {import("express").ErrorRequestHandler} */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const msgForUser = err.msgForUser || "Erro interno do servidor.";

  res.status(statusCode).render("layout", {
    template: "error",
    title: "Erro",
    statusCode,
    msgForUser,
  });
};

module.exports = { routeNotFound, errorHandler };
