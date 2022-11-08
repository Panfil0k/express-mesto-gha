const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '636a1e11f3e377b30ca9d86b',
  };

  next();
});
app.use(usersRouter);
app.use(cardsRouter);
app.use((req, res) => {
  res.status(404).send('Запрашиваемая страница не найдена');
});

app.listen(3000);
