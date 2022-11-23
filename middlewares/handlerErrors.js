const {
  SERVER_ERROR,
  MESSAGE_SERVER_ERROR,
} = require('../utils/constants');

const handlerErrors = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? MESSAGE_SERVER_ERROR
      : message,
  });
  next();
};

module.exports = {
  handlerErrors,
};
