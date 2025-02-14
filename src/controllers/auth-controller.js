const userService = require("../services/user-service");
const { passport } = require("../authentication/passport");

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
  } catch (err) {
    console.error("Error at post sign up form:", err.message);
    next({
      statusCode: 500,
      message: "Houve um erro ao criar o usuário. Tente novamente.",
    });
  }
};

/** @type {import("express").RequestHandler} */
const getLogin = (req, res, next) => {
  res.render("layout", logInViewData);
};

/** @type {import("express").RequestHandler} */
const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).render("layout", {
        ...logInViewData,
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
const getLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = { getSignUp, postSignUp, getLogin, postLogin, getLogout };
