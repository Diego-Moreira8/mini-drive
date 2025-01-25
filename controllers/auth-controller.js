const userService = require("../services/user-service");
const { passport } = require("../authentication/passport");

/** @type {import("express").RequestHandler} */
const getSignUp = (req, res, next) => {
  res.render("layout", {
    template: "pages/sign-up",
    title: "Criar Conta",
    errors: [],
    values: { name: "", username: "", password: "", confirmPassword: "" },
  });
};

/** @type {import("express").RequestHandler} */
const postSignUp = async (req, res, next) => {
  const { name, username, password } = req.body;
  const usernameTaken = await userService.checkExistence(username);

  if (usernameTaken) {
    return res.status(400).render("layout", {
      template: "pages/sign-up",
      title: "Criar Conta",
      errors: [{ msg: "Nome de usuário já existe, tente um diferente" }],
      values: { ...req.body },
    });
  }

  const newUser = await userService.create(name, username, password);
  res.redirect("/log-in");
};

/** @type {import("express").RequestHandler} */
const getLogin = (req, res, next) => {
  res.render("layout", {
    template: "pages/log-in",
    title: "Entrar",
    errors: [],
    values: { username: "" },
  });
};

/** @type {import("express").RequestHandler} */
const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).render("layout", {
        template: "pages/log-in",
        title: "Entrar",
        errors: [{ msg: info.message }],
        values: { ...req.body },
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
};

/** @type {import("express").RequestHandler} */
const postLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = { getSignUp, postSignUp, getLogin, postLogin, postLogout };
