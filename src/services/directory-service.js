const { prisma } = require("../prisma-client/prisma-client");

const directoryNameExists = async (name, parentId) => {
  const nameAlreadyExists = await prisma.directory.findFirst({
    where: {
      AND: {
        name: name,
        parentId: parentId,
      },
    },
  });

  if (nameAlreadyExists) {
    throw new Error(
      `A directory with name "${name}" already exists in the directory with ID ${parentId}.`
    );
  }
};

const create = async (name, userId, parentId) => {
  try {
    await directoryNameExists(name, parentId);

    const newDirectory = await prisma.directory.create({
      data: {
        name: name,
        ownerId: userId,
        parentId: parentId,
      },
    });
    return newDirectory;
  } catch (err) {
    console.error("Error at creating directory:", err.message);
    throw err;
  }
};

const getById = async (directoryId) => {
  try {
    const directory = await prisma.directory.findUnique({
      where: {
        id: directoryId,
      },
      include: {
        subdirectories: true,
        files: true,
      },
    });
    return directory;
  } catch (err) {
    console.error("Error at :", err.message);
    throw err;
  }
};

const getUserRoot = async (userId) => {
  try {
    const directory = prisma.directory.findUnique({
      where: {
        rootOfUserId: userId,
      },
    });
    return directory;
  } catch (err) {
    console.error("Error at retrieving user's root directory:", err.message);
    throw err;
  }
};

const getChildrenDirectories = async (parentId) => {
  try {
    const directories = await prisma.directory.findMany({
      where: {
        parentId: parentId,
      },
      orderBy: {
        name: "asc",
      },
    });
    return directories;
  } catch (err) {
    console.error("Error at retrieving children directories:", err.message);
    throw err;
  }
};

const isDirectoryOfUser = async (directoryId, userId) => {
  try {
    const directory = await prisma.directory.findUnique({
      where: {
        id: directoryId,
      },
    });

    return directory.ownerId === userId;
  } catch (err) {
    console.error(
      "Error at checking if directory belongs to user:",
      err.message
    );
    throw err;
  }
};

const renameDirectory = async (directoryId, newName) => {
  try {
    const directory = await prisma.directory.findUnique({
      where: {
        id: directoryId,
      },
    });

    if (directory.rootOfUserId) {
      throw new Error("Root directory cannot be renamed.");
    }

    await directoryNameExists(newName, directory.parentId);

    const updatedDirectory = await prisma.directory.update({
      where: {
        id: directoryId,
      },
      data: {
        name: newName,
      },
    });
    return updatedDirectory;
  } catch (err) {
    console.error("Error at renaming directory:", err.message);
    throw err;
  }
};

const moveDirectory = async (userId, directoryId, newParentId) => {
  try {
    const directory = await prisma.directory.findUnique({
      where: {
        id: directoryId,
      },
    });

    if (directory.ownerId !== userId) {
      throw new Error(
        `The user with ID ${userId} cannot manipulate the directory with ID ${directory.id}`
      );
    }

    await directoryNameExists(directory.name, newParentId);

    const updatedDirectory = await prisma.directory.update({
      where: {
        id: directoryId,
      },
      data: {
        parentId: newParentId,
      },
    });

    return updatedDirectory;
  } catch (err) {
    console.error("Error at moving directory:", err.message);
    throw err;
  }
};

const deleteDirectoryAndItsFiles = async (directoryId) => {
  try {
    const directory = await prisma.directory.findUnique({
      where: { id: directoryId },
    });

    if (directory.rootOfUserId) {
      throw new Error("Root directory cannot be deleted.");
    }

    const result = await prisma.$transaction([
      prisma.file.deleteMany({ where: { directoryId: directoryId } }),
      prisma.directory.delete({ where: { id: directoryId } }),
    ]);
    return result;
  } catch (err) {
    console.error("Error at deleting directory and its files:", err.message);
    throw err;
  }
};

module.exports = {
  create,
  getById,
  getUserRoot,
  getChildrenDirectories,
  isDirectoryOfUser,
  renameDirectory,
  moveDirectory,
  deleteDirectoryAndItsFiles,
};
