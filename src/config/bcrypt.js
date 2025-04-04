require("dotenv").config();
const bcrypt = require("bcrypt");

const hashPassword = async (plainTextPassword) => {
  try {
    const hash = await bcrypt.hash(plainTextPassword, 10);
    return hash;
  } catch (error) {
    console.error("Error on generating hash");
    throw error;
  }
};

const comparePassword = async (plainTextPassword, hash) => {
  try {
    const result = await bcrypt.compare(plainTextPassword, hash);
    return result;
  } catch (error) {
    console.error("Error on comparing password against hash");
    throw error;
  }
};

module.exports = { hashPassword, comparePassword };
