/** @type {import("express").RequestHandler} */
const getIndex = (req, res, next) => {
  if (req.user) {
    return res.redirect("/pasta");
  }
  res.redirect("/inicio");
};

/** @type {import("express").RequestHandler} */
const getHome = async (req, res, next) => {
  res.render("layout", {
    template: "pages/home-page",
    includeNav: false,
  });
};

module.exports = { getIndex, getHome };
