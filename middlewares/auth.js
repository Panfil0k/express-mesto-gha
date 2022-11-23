const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { MESSAGE_AUTHENTICATION_ERROR, secretKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError(MESSAGE_AUTHENTICATION_ERROR);
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new UnauthorizedError(MESSAGE_AUTHENTICATION_ERROR));
  }

  req.user = payload;

  next();
};
