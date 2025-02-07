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

const getFileFromUser = async (userId, fileId) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) {
    return {
      success: false,
      statusCode: 400,
      message: "Não existe um arquivo com o ID fornecido.",
    };
  }
  if (file.userId !== userId) {
    return {
      success: false,
      statusCode: 403,
      message: "Você não tem autorização para visualizar esse arquivo.",
    };
  }
  return {
    success: true,
    file: file,
  };
};

module.exports = { create, getUserFiles, getFileFromUser };
