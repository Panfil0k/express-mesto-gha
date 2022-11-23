const router = require('express').Router();
const { createCardCheck, cardIdCheck } = require('../utils/celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', createCardCheck, createCard);

router.delete('/cards/:cardId', cardIdCheck, deleteCard);

router.put('/cards/:cardId/likes', cardIdCheck, likeCard);

router.delete('/cards/:cardId/likes', cardIdCheck, dislikeCard);

module.exports = router;
