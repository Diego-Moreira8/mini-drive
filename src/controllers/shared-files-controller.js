const fileService = require("../services/file-service");

/** @type {import("express").RequestHandler} */
const getFilePage = async (req, res, next) => {
  try {
    const file = await fileService.getByShareCode(req.params.shareCode);
    if (!file) {
      throw {
        statusCode: 401,
        msgForUser: "Nenhum arquivo compartilhado com este código!",
      };
    }

    res.render("layout", {
      template: "pages/shared-file-page",
      title: file.fileName,
      file,
    });
  } catch (error) {
    return next(error);
  }
};

/** @type {import("express").RequestHandler} */
const downloadFile = async (req, res, next) => {
  try {
    const file = await fileService.getByShareCode(req.params.shareCode);
    const signedUrl = await fileService.getSignedUrl(
      file.ownerId,
      file.nameOnStorage,
      file.fileName
    );
    res.redirect(signedUrl);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getFilePage, downloadFile };
