const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED_ERROR,
  MESSAGE_AUTHENTICATION_ERROR,
} = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: MESSAGE_AUTHENTICATION_ERROR });
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR).send({ message: MESSAGE_AUTHENTICATION_ERROR });
  }

  req.user = payload;

  next();
};
