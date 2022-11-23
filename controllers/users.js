const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const RequestError = require('../errors/RequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictRequestError = require('../errors/ConflictRequestError');
const {
  OK_STATUS,
  CREATED_STATUS,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
  MESSAGE_UNAUTHORIZED_ERROR,
  MESSAGE_CONFLICT_REQUEST_ERROR,
  secretKey,
} = require('../utils/constants');

const { SALT = 10 } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, SALT)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictRequestError(MESSAGE_CONFLICT_REQUEST_ERROR));
      } else if (err.name === 'ValidationError') {
        next(new RequestError(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.status(OK_STATUS).send({ data: user });
      }
      throw new NotFoundError(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new RequestError(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new RequestError(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        return res.send({ message: 'Успешно авторизован' });
      }
      throw new UnauthorizedError(MESSAGE_UNAUTHORIZED_ERROR);
    })
    .catch(next);
};

const getAuthorizedUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.status(OK_STATUS).send({ data: user });
      }
      throw new NotFoundError(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers, createUser, getUserId, updateUserInfo, updateUserAvatar, login, getAuthorizedUser,
};
