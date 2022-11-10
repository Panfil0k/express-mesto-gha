const express = require('express');
const mongoose = require('mongoose');
const routers = require('./routes/index');

const { PORT = 3000, DATA_BASE = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DATA_BASE);

app.use((req, res, next) => {
  req.user = {
    _id: '636a1e11f3e377b30ca9d86b',
  };

  next();
});
app.use(routers);

app.listen(PORT);
