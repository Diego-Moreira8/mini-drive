const { prisma } = require("../prisma-client/prisma-client");

const createDirectory = async (userId, directoryName, parentId) => {
  const newDirectory = await prisma.directory.create({
    data: {
      ownerId: userId,
      name: directoryName,
      parentId: parentId,
    },
  });

  return newDirectory;
};

module.exports = { createDirectory };
