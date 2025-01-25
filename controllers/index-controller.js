/** @type {import("express").RequestHandler} */
const getHome = (req, res, next) => {
  res.render("layout", {
    template: "pages/home",
    title: "Início",
  });
};

/** @type {import("express").RequestHandler} */
const getProfilePage = (req, res, next) => {
  if (!req.user) {
    throw { statusCode: 401, message: "Esta página requer autenticação." };
  }

  const { name, username } = req.user;
  res.render("layout", {
    template: "pages/profile-page",
    title: "Meu Perfil",
    values: { name, username },
  });
};

module.exports = { getHome, getProfilePage };
