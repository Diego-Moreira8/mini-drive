const { body, validationResult } = require("express-validator");

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
    .withMessage("O nome de usuário pode ter até 50 caracteres"),

  body("password")
    .notEmpty()
    .withMessage("Uma senha precisa ser fornecida")
    .isLength({ min: 8, max: 50 })
    .withMessage("A senha precisa ter entre 8 e 50 caracteres"),

  body("confirmPassword").custom((input, { req }) => {
    if (input !== req.body.password) {
      throw "As senhas não são iguais, tente novamente";
    }
    return true;
  }),

  /** @type {import("express").RequestHandler}} */
  function handleValidation(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).render("layout", {
        template: "pages/sign-up",
        title: "Criar Conta",
        errors: errors.array(),
        values: { ...req.body },
      });
    }

    next();
  },
];

module.exports = { validateSignUpForm };
