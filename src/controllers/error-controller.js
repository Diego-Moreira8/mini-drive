require("dotenv").config();

/** @type {import("express").RequestHandler} */
const routeNotFound = (req, res, next) => {
  throw { statusCode: 404, msgForUser: "Página não encontrada." };
};

/** @type {import("express").ErrorRequestHandler} */
const errorHandler = (error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const msgForUser = error.msgForUser || "Erro interno do servidor.";

  res.status(statusCode).render("layout", {
    template: "error",
    title: "Erro",
    statusCode,
    msgForUser,
  });
};

module.exports = { routeNotFound, errorHandler };
