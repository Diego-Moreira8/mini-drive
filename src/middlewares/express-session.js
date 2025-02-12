require("dotenv").config();
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { prisma } = require("../prisma/prisma-client");

/**
 * Configures and returns the session middleware.
 * @returns {import("express").RequestHandler} Session middleware
 */
function configureSession() {
  return expressSession({
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 15 * 60 * 1000, // 15 minutes
    }),
  });
}

module.exports = { configureSession };
