const { hashPassword, comparePassword } = require("../authentication/bcrypt");
const { prisma } = require("../prisma-client/prisma-client");

const create = async (username, password, name) => {
  try {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password,
          name,
        },
      });

      const rootDirectory = await tx.directory.create({
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

      return { user, rootDirectory };
    });
  } catch (err) {
    console.error("Error at creating user:", err.message);
    throw err;
  }
};

// (async () => {
//   try {
//     const response = await create("username1", "123");
//     console.dir(response);
//   } catch (err) {
//     console.error("Error");
//   }
// })();

const getById = async (id) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (err) {
    console.error("Error at retrieving user by ID:", err.message);
    throw err;
  }
};

const getByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    return user;
  } catch (err) {
    console.error("Error at searching for username:", err.message);
    throw err;
  }
};

const update = async (id, { newUsername, newPassword, newName }) => {
  try {
    const newData = {};

    if (newUsername) {
      newData.username = newUsername;
    }
    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      newData.password = hashedPassword;
    }
    if (newName) {
      newData.name = newName;
    }

    const result = await prisma.user.update({
      where: { id },
      data: { ...newData },
    });

    return result;
  } catch (err) {
    console.error("Error at updating user:", err.message);
    throw err;
  }
};

const verifyPassword = async (userId, plainPassword) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const result = await comparePassword(plainPassword, user.password);
    return result;
  } catch (err) {
    console.error("Error at verifying password:", err.message);
    throw err;
  }
};

const deleteUserAndItsData = async (userId) => {
  try {
    const result = await prisma.$transaction([
      prisma.file.deleteMany({ where: { ownerId: userId } }),
      prisma.directory.deleteMany({ where: { ownerId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
    return result;
  } catch (err) {
    console.error("Error at deleting user:", err.message);
    throw err;
  }
};

module.exports = {
  create,
  getById,
  getByUsername,
  update,
  verifyPassword,
  deleteUserAndItsData,
};
