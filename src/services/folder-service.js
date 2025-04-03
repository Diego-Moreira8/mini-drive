const { prisma } = require("../prisma-client/prisma-client");

const create = async (name, userId, parentId) => {
  try {
    if (await getByName(name, parentId)) {
      throw new Error(
        `A folder with name "${name}" already exists in the folder with ID ${parentId}.`
      );
    }

    const newFolder = await prisma.folder.create({
      data: {
        name: name,
        ownerId: userId,
        parentId: parentId,
      },
    });
    return newFolder;
  } catch (err) {
    console.error("Error at creating folder:", err.message);
    throw err;
  }
};

const getById = async (folderId) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
      include: {
        subFolders: true,
        files: true,
      },
    });
    return folder;
  } catch (err) {
    console.error("Error at :", err.message);
    throw err;
  }
};

const getByName = async (name, parentId) => {
  const foundFolder = await prisma.folder.findFirst({
    where: {
      AND: {
        name: name,
        parentId: parentId,
      },
    },
  });

  return foundFolder;
};

const getUserRoot = async (userId) => {
  try {
    const folder = prisma.folder.findUnique({
      where: {
        rootOfUserId: userId,
      },
    });
    return folder;
  } catch (err) {
    console.error("Error at retrieving user's root folder:", err.message);
    throw err;
  }
};

const getUserFolders = async (userId) => {
  try {
    const folders = prisma.folder.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        name: "asc",
      },
    });
    return folders;
  } catch (err) {
    console.error("Error at retrieving user's folders:", err.message);
    throw err;
  }
};

const getChildrenFolders = async (parentId) => {
  try {
    const folders = await prisma.folder.findMany({
      where: {
        parentId: parentId,
      },
      orderBy: {
        name: "asc",
      },
    });
    return folders;
  } catch (err) {
    console.error("Error at retrieving children folders:", err.message);
    throw err;
  }
};

const isFolderOfUser = async (folderId, userId) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    return folder.ownerId === userId;
  } catch (err) {
    console.error("Error at checking if folder belongs to user:", err.message);
    throw err;
  }
};

const renameFolder = async (folderId, newName) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (folder.name === newName) {
      return folder;
    }

    if (folder.rootOfUserId) {
      throw new Error("Root folder cannot be renamed.");
    }

    if (await getByName(newName, folder.parentId)) {
      throw new Error(
        `A folder with name "${name}" already exists in the folder with ID ${parentId}.`
      );
    }

    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: newName,
      },
    });
    return updatedFolder;
  } catch (err) {
    console.error("Error at renaming folder:", err.message);
    throw err;
  }
};

const moveFolder = async (userId, folderId, newParentId) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (folder.ownerId !== userId) {
      throw new Error(
        `The user with ID ${userId} cannot manipulate the folder with ID ${folder.id}`
      );
    }

    if (await getByName(folder.name, newParentId)) {
      throw new Error(
        `A folder with name "${name}" already exists in the folder with ID ${parentId}.`
      );
    }

    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        parentId: newParentId,
      },
    });

    return updatedFolder;
  } catch (err) {
    console.error("Error at moving folder:", err.message);
    throw err;
  }
};

const deleteFolderAndItsFiles = async (folderId) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (folder.rootOfUserId) {
      throw new Error("Root folder cannot be deleted.");
    }

    const result = await prisma.$transaction([
      prisma.file.deleteMany({ where: { folderId: folderId } }),
      prisma.folder.delete({ where: { id: folderId } }),
    ]);
    return result;
  } catch (err) {
    console.error("Error at deleting folder and its files:", err.message);
    throw err;
  }
};

module.exports = {
  create,
  getById,
  getByName,
  getUserRoot,
  getUserFolders,
  getChildrenFolders,
  isFolderOfUser,
  renameFolder,
  moveFolder,
  deleteFolderAndItsFiles,
};
