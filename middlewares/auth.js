const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const UNAUTHORIZED_ERROR = require('../errors/UnauthorizedError');
const { MESSAGE_AUTHENTICATION_ERROR } = require('../utils/constants');

const secretKey = crypto
  .randomBytes(16)
  .toString('hex');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR);
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    next(new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR));
  }

  req.user = payload;

  next();
};
