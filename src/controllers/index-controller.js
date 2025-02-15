// const userService = require("../services/user-service");

/** @type {import("express").RequestHandler} */
const getIndex = (req, res, next) => {
  if (req.user) {
    return res.redirect("/meus-arquivos");
  }
  res.redirect("/inicio");
};

/** @type {import("express").RequestHandler} */
const getHome = async (req, res, next) => {
  res.render("layout", {
    template: "pages/home",
    title: "Início",
  });
};

// /** @type {import("express").RequestHandler} */
// const getProfilePage = (req, res, next) => {
//   if (!req.user) {
//     throw { statusCode: 401, message: "Esta página requer autenticação." };
//   }

//   const { name, username } = req.user;
//   res.render("layout", {
//     template: "pages/profile-page",
//     title: "Meu Perfil",
//     errors: [],
//     values: { name, username },
//   });
// };

// /** @type {import("express").RequestHandler} */
// const postProfileUpdate = async (req, res, next) => {
//   const { name, username, currentPassword, newPassword } = req.body;

//   let errors = [];
//   if (currentPassword || newPassword) {
//     const correctPassword = await userService.verifyPassword(
//       req.user.id,
//       currentPassword
//     );
//     if (!correctPassword) {
//       errors.push({ msg: "A senha atual está incorreta" });
//     }
//   }
//   const usernameChanged = username !== req.user.username;
//   if (usernameChanged) {
//     const userTaken = await userService.checkExistence(username);
//     if (userTaken) {
//       errors.push({
//         msg: `O nome de usuário ${req.body.username} já existe, escolha outro`,
//       });
//     }
//   }
//   if (errors.length > 0) {
//     return res.status(400).render("layout", {
//       template: "pages/profile-page",
//       title: "Meu Perfil",
//       errors,
//       values: req.body,
//     });
//   }

//   await userService.update(req.user.id, name || null, username, newPassword);

//   res.render("layout", {
//     template: "pages/message",
//     title: "Modificações Salvas",
//     message: "Modificações realizadas com sucesso!",
//   });
// };

// module.exports = { getHome, getProfilePage, postProfileUpdate };
module.exports = { getIndex, getHome };
