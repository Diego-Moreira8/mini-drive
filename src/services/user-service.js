const { hashPassword, comparePassword } = require("../config/bcrypt");
const prisma = require("../config/prisma-client");

const isValidUsername = (username) => /^[a-zA-Z0-9]+$/.test(username);

const create = async (username, password, name) => {
  try {
    if (!isValidUsername(username)) {
      throw new Error("Invalid username");
    }

    return prisma.$transaction(async (tx) => {
      const hashedPassword = await hashPassword(password);

      const user = await tx.user.create({
        data: {
          username: username.toLowerCase(),
          password: hashedPassword,
          name,
        },
      });

      const rootFolder = await tx.folder.create({
        data: {
          name: "__root__",
          owner: {
            connect: { id: user.id },
          },
          rootOfUser: {
            connect: { id: user.id },
          },
        },
      });

      return { user, rootFolder };
    });
  } catch (error) {
    console.error("Error at creating user");
    throw error;
  }
};

const getById = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error("Error at retrieving user by ID");
    throw error;
  }
};

const getByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });
    return user;
  } catch (error) {
    console.error("Error at retrieving user by username");
    throw error;
  }
};

const getDriveUsage = async (userId) => {
  try {
    const filesSizes = await prisma.file.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        size: true,
      },
    });

    const totalBytes = filesSizes.reduce((a, c) => a + c.size, 0);
    return totalBytes;
  } catch (error) {
    throw error;
  }
};

const update = async (id, { newUsername, newPassword, newName }) => {
  try {
    const newData = {};

    if (newUsername) {
      if (!isValidUsername(newUsername)) {
        throw new Error("Invalid username");
      }
      newData.username = newUsername;
    }
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      newData.password = hashedPassword;
    }

    newData.name = newName;

    const result = await prisma.user.update({
      where: { id },
      data: { ...newData },
    });

    return result;
  } catch (error) {
    console.error("Error at updating user");
    throw error;
  }
};

const verifyPassword = async (userId, plainPassword) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const result = await comparePassword(plainPassword, user.password);
    return result;
  } catch (error) {
    console.error("Error at verifying password");
    throw error;
  }
};

const deleteUserAndItsData = async (userId) => {
  try {
    const result = await prisma.$transaction([
      prisma.file.deleteMany({ where: { ownerId: userId } }),
      prisma.folder.deleteMany({ where: { ownerId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    return result;
  } catch (error) {
    console.error("Error at deleting user");
    throw error;
  }
};

module.exports = {
  isValidUsername,
  create,
  getById,
  getByUsername,
  getDriveUsage,
  update,
  verifyPassword,
  deleteUserAndItsData,
};
