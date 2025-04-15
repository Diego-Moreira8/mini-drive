require("dotenv").config();

function checkEnvVars(requiredVars) {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length) {
    console.error("Environment variable missing:");
    missing.forEach((key) => console.error(`- ${key}`));
    process.exit(1);
  }
}

module.exports = checkEnvVars;
