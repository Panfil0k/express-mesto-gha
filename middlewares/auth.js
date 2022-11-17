const jwt = require('jsonwebtoken');
const UNAUTHORIZED_ERROR = require('../errors/UnauthorizedError');
const { MESSAGE_AUTHENTICATION_ERROR } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR);
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR));
  }

  req.user = payload;

  next();
};
