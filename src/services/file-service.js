const { prisma } = require("../prisma-client/prisma-client");

const create = async (userId, directoryId, fileRequest) => {
  const { originalname, encoding, mimetype, filename, size } = fileRequest;

  const newFile = await prisma.file.create({
    data: {
      fileName: originalname,
      nameOnStorage: filename,
      size: size,
      mimeType: mimetype,
      encoding: encoding,
      ownerId: userId,
      directoryId: directoryId,
    },
  });

  return newFile;
};

const getUserFiles = async (userId) => {
  const userFiles = await prisma.file.findMany({ where: { ownerId: userId } });
  return userFiles;
};

const getUserRoot = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const directory = await prisma.directory.findFirst({
    where: { AND: { ownerId: user.id, isRoot: true } },
    include: { subdirectories: true, files: true },
  });
  return directory;
};

const getFile = async (fileId) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  return file;
};

const deleteFile = async (fileId) => {
  const deletedFile = await prisma.file.delete({ where: { id: fileId } });
  return deletedFile;
};

module.exports = {
  create,
  getUserFiles,
  getFile,
  deleteFile,
  getUserRoot,
};
