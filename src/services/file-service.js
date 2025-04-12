const uuid = require("uuid").v4;
const prisma = require("../config/prisma-client");
const supabase = require("../config/supabase-client");
const splitFileName = require("../utils/split-file-name");
const folderService = require("./folder-service");

const USERS_FILES_BUCKET = "users-files";

const create = async (
  userId,
  folderId,
  fileName,
  size,
  mimeType,
  fileBuffer
) => {
  let newFile;

  try {
    if (!(await folderService.isFolderOfUser(folderId, userId))) {
      throw new Error(
        `The user with ID ${userId} cannot manipulate the folder with ID ${folderId}.`
      );
    }

    const nameTaken = await checkDuplication(folderId, fileName);
    const { baseName, extension } = splitFileName(fileName);
    const adaptedFileName = baseName + " (cópia)." + extension;

    const nameOnStorage = uuid();

    // Store file details on database
    newFile = await prisma.file.create({
      data: {
        nameOnStorage,
        fileName: nameTaken ? adaptedFileName : fileName,
        size: size,
        mimeType: mimeType,
        ownerId: userId,
        folderId: folderId,
      },
    });

    // Upload file to user's folders in the bucket
    const { error } = await supabase.storage
      .from(USERS_FILES_BUCKET)
      .upload(`${userId}/${nameOnStorage}`, fileBuffer);

    if (error) {
      throw error;
    }

    return newFile;
  } catch (error) {
    console.log("erooo", error);
    await prisma.file.delete({ where: { id: newFile.id } });
    console.error("Error at creating file");
    throw error;
  }
};

const getById = async (fileId) => {
  try {
    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
      include: {
        owner: true,
      },
    });
    return file;
  } catch (error) {
    console.error("Error at retrieving file");
    throw error;
  }
};

const checkDuplication = async (folderId, fileName) => {
  try {
    const filesInFolder = await prisma.file.findMany({ where: { folderId } });
    const foundFiles = filesInFolder.find((f) => fileName === f.fileName);
    return foundFiles;
  } catch (error) {
    console.error("Error at checking duplication");
    throw error;
  }
};

const rename = async (fileId, newName) => {
  try {
    const file = await prisma.file.update({
      where: {
        id: fileId,
      },
      data: {
        fileName: newName,
      },
    });
    return file;
  } catch (error) {
    console.error("Error at renaming file");
    throw error;
  }
};

const renameSafe = async (fileId, newName) => {
  try {
    const preserveFileExtension = (fileName, newName) => {
      let result = fileName.split(".");
      result[0] = newName;
      result = result.join(".");
      return result;
    };

    const file = await getById(fileId);
    const updatedFile = await rename(
      fileId,
      preserveFileExtension(file.fileName, newName)
    );

    return updatedFile;
  } catch (error) {
    console.error("Error at safe renaming file");
    throw error;
  }
};

const deleteFile = async (fileId) => {
  try {
    const deletedFile = await prisma.file.delete({ where: { id: fileId } });
    const { ownerId, nameOnStorage } = deletedFile;

    await supabase.storage
      .from(USERS_FILES_BUCKET)
      .remove(`${ownerId}/${nameOnStorage}`);

    return deletedFile;
  } catch (error) {
    console.error("Error at deleting file");
    throw error;
  }
};

const getSignedUrl = async (userId, nameOnStorage, originalName) => {
  try {
    const { data, error } = await supabase.storage
      .from(USERS_FILES_BUCKET)
      .createSignedUrl(`${userId}/${nameOnStorage}`, 60, {
        download: originalName,
      });

    if (error) throw error;

    return data.signedUrl;
  } catch (error) {
    console.error("Error at generating signed URL of the file.");
    throw error;
  }
};

const share = async (fileId) => {
  try {
    await prisma.file.update({
      where: { id: fileId },
      data: { shareCode: uuid() },
    });
  } catch (error) {
    console.error("Error at adding file share code.");
  }
};

const stopShare = async (fileId) => {
  try {
    await prisma.file.update({
      where: { id: fileId },
      data: { shareCode: null },
    });
  } catch (error) {
    console.error("Error at stopping file share.");
  }
};

const getByShareCode = async (shareCode) => {
  try {
    const file = await prisma.file.findUnique({
      where: { shareCode },
      include: { owner: true },
    });
    return file;
  } catch (error) {
    console.error("Error at stopping file share.");
  }
};

module.exports = {
  create,
  getById,
  checkDuplication,
  rename,
  renameSafe,
  deleteFile,
  getSignedUrl,
  share,
  stopShare,
  getByShareCode,
};
