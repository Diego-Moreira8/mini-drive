const prisma = require("../config/prisma-client");

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
  } catch (error) {
    console.error("Error at creating folder");
    throw error;
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
  } catch (error) {
    console.error("Error at retrieving folder by ID");
    throw error;
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
  } catch (error) {
    console.error("Error at retrieving user's root folder");
    throw error;
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
  } catch (error) {
    console.error("Error at retrieving user's folders");
    throw error;
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
  } catch (error) {
    console.error("Error at retrieving children folders from parent");
    throw error;
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
  } catch (error) {
    console.error("Error at checking if folder belongs to user");
    throw error;
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
  } catch (error) {
    console.error("Error at renaming folder");
    throw error;
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
  } catch (error) {
    console.error("Error at moving folder");
    throw error;
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
  } catch (error) {
    console.error("Error at deleting folder and its files");
    throw error;
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
