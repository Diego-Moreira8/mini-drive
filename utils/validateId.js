const validateId = (id) => {
  const integerId = parseInt(id);
  if (isNaN(integerId)) {
    throw {
      statusCode: 400,
      message: "O ID fornecido precisa ser um número.",
    };
  }
  return integerId;
};

module.exports = validateId;
