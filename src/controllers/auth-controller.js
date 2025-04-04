const userService = require("../services/user-service");
const passport = require("../config/passport");

const signUpViewData = {
  template: "pages/sign-up",
  title: "Criar Conta",
  errors: [],
  values: { name: "", username: "", password: "", confirmPassword: "" },
};

const logInViewData = {
  template: "pages/log-in",
  title: "Entrar",
  errors: [],
  values: { username: "" },
};

/** @type {import("express").RequestHandler} */
const getSignUp = (req, res, next) => {
  res.render("layout", signUpViewData);
};

/** @type {import("express").RequestHandler} */
const postSignUp = async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const usernameTaken = await userService.getByUsername(username);

    if (usernameTaken) {
      return res.status(400).render("layout", {
        ...signUpViewData,
        errors: [{ msg: "Nome de usuário já existe, tente um diferente" }],
        values: { ...req.body },
      });
    }

    await userService.create(username, password, name);
    // Redirect to log-in page
    res.redirect("/entrar");
  } catch (error) {
    next(error);
  }
};

/** @type {import("express").RequestHandler} */
const getLogin = (req, res, next) => {
  res.render("layout", logInViewData);
};

/** @type {import("express").RequestHandler} */
const postLogin = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).render("layout", {
        ...logInViewData,
        errors: [{ msg: info.message }],
        values: { ...req.body },
      });
    }

    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      res.redirect("/");
    });
  })(req, res, next);
};

/** @type {import("express").RequestHandler} */
const getLogout = (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/");
  });
};

module.exports = { getSignUp, postSignUp, getLogin, postLogin, getLogout };
