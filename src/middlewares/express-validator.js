const { body, validationResult } = require("express-validator");
const { isValidUsername } = require("../services/user-service");

const validateSignUpForm = [
  body("name")
    .trim()
    .isLength({ max: 250 })
    .withMessage("O nome pode ter no máximo 250 caracteres"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Um nome de usuário precisa ser fornecido")
    .isLength({ max: 50 })
    .withMessage("O nome de usuário pode ter até 50 caracteres")
    .custom((input) => {
      if (!isValidUsername(input)) {
        throw new Error("O nome de usuário contém caracteres não permitidos");
      }
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Uma senha precisa ser fornecida")
    .isLength({ min: 8, max: 50 })
    .withMessage("A senha precisa ter entre 8 e 50 caracteres"),

  body("confirmPassword").custom((input, { req }) => {
    if (input !== req.body.password) {
      throw new Error("As senhas não são iguais, tente novamente");
    }
    return true;
  }),

  /** @type {import("express").RequestHandler}} */
  function handleValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("layout", {
        template: "pages/sign-up-page",
        title: "Criar Conta",
        errors: errors.array(),
        values: { ...req.body },
      });
    }

    next();
  },
];

const validateUpdateProfileForm = [
  body("name")
    .trim()
    .isLength({ max: 250 })
    .withMessage("O nome pode ter no máximo 250 caracteres"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Um nome de usuário precisa ser fornecido")
    .isLength({ max: 50 })
    .withMessage("O nome de usuário pode ter até 50 caracteres")
    .custom((input) => {
      if (!isValidUsername(input)) {
        throw new Error("O nome de usuário contém caracteres não permitidos");
      }
      return true;
    }),

  body("newPassword").custom((input, { req }) => {
    if (input.length > 0 && (input.length < 8 || input.length > 50)) {
      throw new Error("A nova senha precisa ter entre 8 e 50 caracteres");
    }
    if (input && !req.body.currentPassword) {
      throw new Error("Para alterar sua senha, a atual precisa ser fornecida");
    }
    return true;
  }),

  body("confirmPassword").custom((input, { req }) => {
    if (input !== req.body.newPassword) {
      throw new Error("As senhas não são iguais, tente novamente");
    }
    return true;
  }),

  /** @type {import("express").RequestHandler}} */
  function handleValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("layout", {
        template: "pages/user-profile-page",
        title: "Meu Perfil",
        errors: errors.array(),
        values: { ...req.body },
      });
    }

    next();
  },
];

const validateContentForm = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("O nome não pode ficar vazio")
    .isLength({ max: 250 })
    .withMessage("O nome pode ter no máximo 250 caracteres")
    .custom((input) => {
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(input)) {
        throw new Error(`
          Alguns caracteres não são permitidos em nomes de arquivos, pois podem
          causar erros ao fazer download. Os caracteres proibidos são:
          < > : " / \\ | ? *
        `);
      }
      return true;
    }),

  /** @type {import("express").RequestHandler}} */
  function storeErrors(req, res, next) {
    const errors = validationResult(req);
    res.locals = { ...res.locals, formErrors: errors.array() };
    next();
  },
];

module.exports = {
  validateSignUpForm,
  validateUpdateProfileForm,
  validateContentForm,
};
