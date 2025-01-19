const { hashPassword, comparePassword } = require("../authentication/bcrypt");
const { prisma } = require("../prisma/prisma-client");

const getById = async (id) => {
  const foundUsername = await prisma.user.findUnique({
    where: { id },
  });
  return foundUsername;
};

const checkExistence = async (username) => {
  const foundUsername = await prisma.user.findUnique({
    where: { username },
  });
  return foundUsername;
};

const create = async (name, username, password) => {
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      name: name || null,
      username: username,
      password: hashedPassword,
    },
  });
  return newUser;
};

const verifyPassword = async (userId, plainPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const result = await comparePassword(plainPassword, user.password);
  return result;
};

module.exports = { getById, checkExistence, create, verifyPassword };
