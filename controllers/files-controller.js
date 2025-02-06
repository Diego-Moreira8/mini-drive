const fileService = require("../services/file-service");

/** @type {import("express").RequestHandler} */
const uploadFile = async (req, res, next) => {
  await fileService.create(req.user.id, req.file);
  res.send(req.file);
};

module.exports = { uploadFile };
