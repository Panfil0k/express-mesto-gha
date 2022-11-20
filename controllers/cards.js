const Card = require('../models/card');
const REQUEST_ERROR = require('../errors/RequestError');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const FORBIDDEN_ERROR = require('../errors/ForbiddenError');
const {
  CREATED_STATUS,
  MESSAGE_REQUEST_ERROR,
  MESSAGE_NOT_FOUND_ERROR,
  MESSAGE_FORBIDDEN_ERROR,
} = require('../utils/constants');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        throw new NOT_FOUND_ERROR(MESSAGE_NOT_FOUND_ERROR);
      } else if (card.owner.toString() === req.user._id) {
        return res.send({ data: card });
      }
      throw new FORBIDDEN_ERROR(MESSAGE_FORBIDDEN_ERROR);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new REQUEST_ERROR(MESSAGE_REQUEST_ERROR));
      } else {
        next(err);
      }
    });
};

const likeHandler = (req, res, next, handler) => {
  Card.findByIdAndUpdate(req.params.cardId, handler, { new: true })
    .then((card) => {
      if (card) {
        return res.send({ data: card });
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

const likeCard = (req, res, next) => {
  likeHandler(req, res, next, { $addToSet: { likes: req.user._id } });
};

const dislikeCard = (req, res, next) => {
  likeHandler(req, res, next, { $pull: { likes: req.user._id } });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
