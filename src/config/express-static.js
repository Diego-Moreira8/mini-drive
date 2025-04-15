const path = require("path");

const root = path.join(__dirname, "../public");

const options = {
  maxAge: "7d",
  setHeaders: (res, file) => {
    if (path.extname(file) === ".html") {
      res.setHeader("Cache-Control", "public, max-age=0");
    }
  },
};

module.exports = { root, options };
