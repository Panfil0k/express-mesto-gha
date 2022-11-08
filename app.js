const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(usersRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '636a1e11f3e377b30ca9d86b',
  };

  next();
});

app.listen(3000);
