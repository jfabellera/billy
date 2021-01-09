const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const config = require('./config');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

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

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Token = require('./models/tokenModel');
const User = require('./models/userModel');

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  Token.findOne({ refresh_token: refreshToken }, (err, token) => {
    if (err) throw err;
    if (!token) return res.sendStatus(401);
    jwt.verify(refreshToken, config.jwt_refresh_secret, (err, decoded) => {
      if (err) return res.sendStatus(401);
      const accessToken = generateAccessToken(decoded.user);
      res.json({ accessToken: accessToken });
    });
  });
});

app.delete('/logout', (req, res) => {
  // delete refresh token from database
  Token.findOneAndDelete({ refresh_token: req.body.token }, (err, token) => {
    if (err) throw err;
  });

  res.sendStatus(204);
});

app.post('/login', [check(['username', 'password']).exists()], (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json(err.errors);
  } else {
    User.findOne(
      { username: req.body.username.toLowerCase() },
      async (err, user) => {
        if (err) throw err;
        try {
          if (
            user != null &&
            !user.disabled &&
            (await bcrypt.compare(req.body.password, user.password_hash))
          ) {
            // authorized
            let userInfo = {};
            userInfo.username = user.username;
            userInfo.name = user.name;
            userInfo.account_type = user.account_type;

            const accessToken = generateAccessToken(userInfo);
            const refreshToken = jwt.sign(
              { user: userInfo },
              config.jwt_refresh_secret
            );

            // add refresh token to database
            Token.create(
              {
                refresh_token: refreshToken,
                user_id: user._id,
              },
              (err, token) => {
                if (err) throw err;
              }
            );

            res.json({ accessToken: accessToken, refreshToken: refreshToken });
          } else {
            // unauthorized
            res.status(401).json({ message: 'Authentication failed' });
          }
        } catch {
          // error
          res.status(500).send();
        }
      }
    );
  }
});

function generateAccessToken(user) {
  return jwt.sign({ user }, config.jwt_access_secret, { expiresIn: '15m' });
}

app.listen(3000);
