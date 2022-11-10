const User = require('../models/user');
const {
  CREATED_STATUS,
  REQUEST_ERROR,
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  MESSAGE_SERVER_ERROR,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
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
      return res.status(NOT_FOUND_ERROR).send({ message: MESSAGE_NOT_FOUND_ERROR });
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
      return res.status(NOT_FOUND_ERROR).send({ message: MESSAGE_NOT_FOUND_ERROR });
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
      return res.status(NOT_FOUND_ERROR).send({ message: MESSAGE_NOT_FOUND_ERROR });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

module.exports = {
  getUsers, createUser, getUserId, updateUserInfo, updateUserAvatar,
};
