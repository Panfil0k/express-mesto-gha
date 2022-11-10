const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { NOT_FOUND_ERROR } = require('../utils/constants');

router.use(usersRouter);
router.use(cardsRouter);
router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая страница не найдена' });
});

module.exports = router;
