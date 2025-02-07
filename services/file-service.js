const { prisma } = require("../prisma/prisma-client");

const create = async (userId, fileRequest) => {
  const { originalname, encoding, mimetype, filename, size } = fileRequest;

  const newFile = await prisma.file.create({
    data: {
      fileName: originalname,
      nameOnStorage: filename,
      size: size,
      mimeType: mimetype,
      encoding: encoding,
      userId: userId,
    },
  });

  return newFile;
};

const getUserFiles = async (userId) => {
  const userFiles = await prisma.file.findMany({ where: { userId: userId } });
  return userFiles;
};

module.exports = { create, getUserFiles };
