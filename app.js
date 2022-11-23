const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const routes = require('./routes/index');
const auth = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');
const {
  SERVER_ERROR,
  MESSAGE_SERVER_ERROR,
} = require('./utils/constants');

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATA_BASE);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use(routes);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR
      ? MESSAGE_SERVER_ERROR
      : message,
  });
});

app.listen(PORT);
