/** @type {import("express").RequestHandler} */
const getHome = (req, res, next) => {
  res.render("layout", {
    template: "pages/home",
    title: "Início",
  });
};

module.exports = { getHome };
