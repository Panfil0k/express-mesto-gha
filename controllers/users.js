const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const REQUEST_ERROR = require('../errors/RequestError');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const UNAUTHORIZED_ERROR = require('../errors/UnauthorizedError');
const CONFLICT_REQUEST_ERROR = require('../errors/ConflictRequestError');
const {
  OK_STATUS,
  CREATED_STATUS,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
  MESSAGE_UNAUTHORIZED_ERROR,
  MESSAGE_CONFLICT_REQUEST_ERROR,
} = require('../utils/constants');

// const secretKey = crypto
//   .randomBytes(16)
//   .toString('hex');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(CREATED_STATUS).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new CONFLICT_REQUEST_ERROR(MESSAGE_CONFLICT_REQUEST_ERROR));
      } else if (err.name === 'ValidationError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
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
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
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
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
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
      throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
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
        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        res.send();
      }
      throw new UNAUTHORIZED_ERROR(MESSAGE_UNAUTHORIZED_ERROR);
    })
    .catch(next);
};

const getAuthorizedUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(() => new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR))
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers, createUser, getUserId, updateUserInfo, updateUserAvatar, login, getAuthorizedUser,
};
