const { hashPassword } = require("../authentication/bcrypt");
const { prisma } = require("../prisma/prisma-client");

const checkExistence = async (username) => {
  const foundUsername = await prisma.user.findUnique({
    where: { username },
  });
  return Boolean(foundUsername);
};

const create = async (username, password) => {
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });
  return newUser;
};

module.exports = { checkExistence, create };
