require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes/index');
const { handlerErrors } = require('./middlewares/handlerErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const options = {
  origin: [
    'http://localhost:3000',
    'https://panfilok.students.nomoredomains.club',
    'https://panfil0k.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use('*', cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATA_BASE);

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handlerErrors);

app.listen(PORT);
