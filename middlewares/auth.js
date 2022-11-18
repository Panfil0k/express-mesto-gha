const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UNAUTHORIZED_ERROR = require('../errors/UnauthorizedError');
const { MESSAGE_AUTHENTICATION_ERROR, secretKey } = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR);
  }

  let payload;

  try {
    payload = jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return false;
      return User.findOne({ _id: decoded._id }).then((user) => Boolean(user));
    });
  } catch (err) {
    next(new UNAUTHORIZED_ERROR(MESSAGE_AUTHENTICATION_ERROR));
  }

  req.user = payload;

  next();
};
