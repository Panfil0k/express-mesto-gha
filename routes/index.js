const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { signinCheck, signupCheck } = require('../utils/celebrate');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');

router.post('/signin', signinCheck, login);

router.post('/signup', signupCheck, createUser);

router.use(auth);
router.use(usersRouter);
router.use(cardsRouter);
router.use('*', (req, res, next) => {
  next(new NOT_FOUND_ERROR('Запрашиваемая страница не найдена'));
});

module.exports = router;
