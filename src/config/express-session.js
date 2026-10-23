require("dotenv").config();
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("./prisma-client");

let sessionMiddleware;

const expressSessionConfig = async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    // Create the Prisma-backed session store only after the database responds.
    sessionMiddleware ??= expressSession({
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
      secret: process.env.SESSION_COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 15 * 60 * 1000, // 15 minutes
      }),
    });

    sessionMiddleware(req, res, next);
  } catch (error) {
    next({
      statusCode: 500,
      msgForUser:
        "O banco de dados parece estar suspenso." +
        "Isso ocorre após um período de inatividade da aplicação." +
        "Tente novamente em alguns minutos ou entre em contato com o " +
        "desenvolvedor: diego.moreira529@gmail.com",
    });
  }
};

module.exports = expressSessionConfig;
