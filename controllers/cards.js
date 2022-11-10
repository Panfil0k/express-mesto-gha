const Card = require('../models/card');
const {
  REQUEST_ERROR,
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  MESSAGE_SERVER_ERROR,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(REQUEST_ERROR).send({ message: MESSAGE_REQUEST_ERROR });
      }
      return res.status(SERVER_ERROR).send({ message: MESSAGE_SERVER_ERROR });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({ data: card });
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

const likeHandler = (req, res, handler) => {
  Card.findByIdAndUpdate(req.params.cardId, handler, { new: true })
    .populate('likes')
    .then((card) => {
      if (card) {
        return res.send({ data: card });
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

const likeCard = (req, res) => {
  likeHandler(req, res, { $addToSet: { likes: req.user._id } });
};

const dislikeCard = (req, res) => {
  likeHandler(req, res, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
