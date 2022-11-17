const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserId, updateUserInfo, updateUserAvatar, getAuthorizedUser,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), getUserId);

router.get('/users/me', getAuthorizedUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({ scheme: ['http', 'https'] }),
  }),
}), updateUserAvatar);

module.exports = router;
