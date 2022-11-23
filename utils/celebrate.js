const { celebrate, Joi } = require('celebrate');
const REGEX_URL = require('./constants');

const signinCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const signupCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(REGEX_URL),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
});

const userIdCheck = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const userInfoCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const userAvatarCheck = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(REGEX_URL),
  }),
});

const createCardCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(REGEX_URL),
  }).unknown(true),
});

const cardIdCheck = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  signinCheck,
  signupCheck,
  userIdCheck,
  userInfoCheck,
  userAvatarCheck,
  createCardCheck,
  cardIdCheck,
};
