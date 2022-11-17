const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');

router.use(usersRouter);
router.use(cardsRouter);
router.use('*', (req, res, next) => {
  next(new NOT_FOUND_ERROR('Запрашиваемая страница не найдена'));
});

module.exports = router;
