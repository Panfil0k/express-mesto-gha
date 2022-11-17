const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const {
  CREATED_STATUS,
  REQUEST_ERROR,
  SERVER_ERROR,
  UNAUTHORIZED_ERROR,
  MESSAGE_SERVER_ERROR,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
} = require('../utils/constants');

const secretKey = crypto
  .randomBytes(16)
  .toString('hex');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
    });
};

module.exports = {
  getUsers, createUser, getUserId, updateUserInfo, updateUserAvatar, login,
};
