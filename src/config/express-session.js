require("dotenv").config();
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma-client");

const expressSessionOptions = {
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  secret: process.env.SESSION_COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 15 * 60 * 1000, // 15 minutes
  }),
};

module.exports = expressSessionOptions;
