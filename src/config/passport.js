const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userService = require("../services/user-service");

passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    const user = await userService.getByUsername(username);
    if (!user) {
      return done(null, false, { message: "Nome de usuário incorreto" });
    }

    const passwordMatch = await userService.verifyPassword(user.id, password);
    if (!passwordMatch) {
      return done(null, false, { message: "Senha incorreta" });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
