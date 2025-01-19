const userService = require("../services/user-service");

/** @type {import("express").RequestHandler} */
const getSignUp = (req, res, next) => {
  res.render("layout", {
    template: "pages/sign-up",
    title: "Criar Conta",
    errors: [],
    values: { username: "", password: "" },
  });
};

/** @type {import("express").RequestHandler} */
const postSignUp = async (req, res, next) => {
  const { username, password } = req.body;
  const usernameTaken = await userService.checkExistence(username);

  if (usernameTaken) {
    return res.status(400).render("layout", {
      template: "pages/sign-up",
      title: "Criar Conta",
      errors: [{ msg: "Nome de usuário já existe, tente um diferente" }],
      values: { ...req.body },
    });
  }

  const newUser = await userService.create(username, password);
  res.json(newUser);
};

module.exports = { getSignUp, postSignUp };
