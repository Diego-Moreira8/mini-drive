require("dotenv").config();
const bcrypt = require("bcrypt");

const hashPassword = async (plainTextPassword) => {
  try {
    const hash = await bcrypt.hash(plainTextPassword, 10);
    return hash;
  } catch (err) {
    console.error("Error on generating hash:", err.message);
    throw err;
  }
};

const comparePassword = async (plainTextPassword, hash) => {
  try {
    const result = await bcrypt.compare(plainTextPassword, hash);
    return result;
  } catch (err) {
    console.error("Error on comparing password against hash:", err.message);
    throw err;
  }
};

module.exports = { hashPassword, comparePassword };
