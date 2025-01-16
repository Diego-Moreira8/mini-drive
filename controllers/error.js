require("dotenv").config();

/** @type {import("express").RequestHandler} */
routeNotFound = (req, res, next) => {
  throw { statusCode: 404, message: "Página não encontrada." };
};

/** @type {import("express").ErrorRequestHandler} */
errorHandler = (err, req, res, next) => {
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor.";

  res.status(statusCode).render("layout", {
    template: "error",
    title: "Erro",
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = { routeNotFound, errorHandler };
