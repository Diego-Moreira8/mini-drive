/** @type {import("express").RequestHandler} */
getSignUp = (req, res, next) => {
  res.render("layout", {
    template: "pages/sign-up",
    title: "Criar Conta",
  });
};

module.exports = { getSignUp };
