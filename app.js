const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config');

mongoose.connect(config.mongodb_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});

const usersRouter = require('./routes/users');
const expensesRouter = require('./routes/expenses');
const accountRouter = require('./routes/accounts');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/expenses', expensesRouter.router);
app.use('/accounts', accountRouter.router);

app.listen(5000);
