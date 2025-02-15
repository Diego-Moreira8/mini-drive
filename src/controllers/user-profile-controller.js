const userService = require("../services/user-service");

const getProfileViewData = (errorsArray, { name, username }) => {
  return {
    template: "pages/profile-page",
    title: "Meu Perfil",
    errors: errorsArray.length > 0 ? errorsArray : [],
    values: { name, username },
  };
};

const getDeleteAccountViewData = (errorsArray) => {
  return {
    template: "pages/delete-account",
    title: "Apagar Minha Conta",
    errors: errorsArray.length > 0 ? errorsArray : [],
  };
};

/** @type {import("express").RequestHandler} */
const getProfilePage = (req, res, next) => {
  if (!req.user) {
    throw { statusCode: 401, msgForUser: "Esta página requer autenticação." };
  }

  const { name, username } = req.user;
  res.render("layout", getProfileViewData([], { name, username }));
};

/** @type {import("express").RequestHandler} */
const postProfileUpdate = async (req, res, next) => {
  try {
    const { name, username, currentPassword, newPassword } = req.body;
    let errors = [];

    const usernameChange = username !== req.user.username;
    if (usernameChange) {
      const usernameTaken = await userService.getByUsername(username);
      if (usernameTaken) {
        errors.push({
          msg: `O nome de usuário ${req.body.username} já existe, escolha outro`,
        });
      }
    }

    const passwordChange = currentPassword || newPassword;
    if (passwordChange) {
      const correctCurrentPassword = await userService.verifyPassword(
        req.user.id,
        currentPassword
      );
      if (!correctCurrentPassword) {
        errors.push({ msg: "A senha atual está incorreta" });
      }
    }

    if (errors.length > 0) {
      return res
        .status(400)
        .render("layout", getProfileViewData(errors, req.body));
    }

    await userService.update(req.user.id, {
      newUsername: usernameChange ? username : null,
      newPassword: passwordChange ? newPassword : null,
      newName: name,
    });

    res.render("layout", {
      template: "pages/message",
      title: "Modificações Salvas",
      message: "Modificações realizadas com sucesso!",
    });
  } catch (err) {
    next(err);
  }
};

/** @type {import("express").RequestHandler} */
const getDeleteAccountPage = (req, res, next) => {
  res.render("layout", getDeleteAccountViewData([]));
};

/** @type {import("express").RequestHandler} */
const postProfileDelete = async (req, res, next) => {
  try {
    const passwordMatch = await userService.verifyPassword(
      req.user.id,
      req.body.password
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .render(
          "layout",
          getDeleteAccountViewData([
            { msg: "Senha incorreta. Tente novamente" },
          ])
        );
    }

    await userService.deleteUserAndItsData(req.user.id);

    req.logout((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfilePage,
  postProfileUpdate,
  getDeleteAccountPage,
  postProfileDelete,
};
