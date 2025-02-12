require("dotenv").config();
const bcrypt = require("bcrypt");

const saltRounds = parseInt(process.env.BCRYPT_SALT);

const hashPassword = async (plainTextPassword) => {
  try {
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
  } catch (err) {
    console.error("Error on generating hash:", err);
    throw { statusCode: 500, message: "Erro ao tentar salvar a senha." };
  }
};

const comparePassword = async (plainTextPassword, hash) => {
  try {
    const result = await bcrypt.compare(plainTextPassword, hash);
    return result;
  } catch (err) {
    console.error("Error on comparing password against hash:", err);
    throw { statusCode: 500, message: "Erro ao tentar ler a senha." };
  }
};

module.exports = { hashPassword, comparePassword };
