const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = require('../../models/userModel');
const Expense = require('../../models/expenseModel');
const Account = require('../../models/accountModel');

auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    // verify token
    jwt.verify(token, config.jwt_access_secret, (err, decoded) => {
      if (err) return res.sendStatus(401);

      User.findOne({ username: decoded.user.username }, (userErr, user) => {
        if (userErr || !user) return res.sendStatus(401);

        // add user from payload
        req.user = user;

        let queries = [];

        if (req.params.expense_id)
          queries.push(Expense.findOne({ _id: req.params.expense_id }).exec());
        if (req.params.account_id)
          queries.push(Account.findOne({ _id: req.params.account_id }).exec());

        Promise.all(queries).then((results) => {
          results.forEach((result) => {
            if (String(result.user_id) !== String(user._id))
              return res.sendStatus(401);
          });

          // If username is in the URL, confirm token auth
          if (req.params.username && req.params.username !== user.username)
            return res.sendStatus(401);

          // If user_id is in the body, confirm token auth
          if (req.body.user_id && String(req.body.user_id) !== String(user._id))
            return res.sendStatus(401);

          next();
        });
      });
    });
  } catch (e) {
    return res.sendStatus(401);
  }
};

authAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    // verify token
    jwt.verify(token, config.jwt_access_secret, (err, decoded) => {
      if (err) return res.sendStatus(401);

      User.findOne({ username: decoded.user.username }, (userErr, user) => {
        if (userErr || !user) return res.sendStatus(401);
        if (user.account_type !== 'admin' && user.account_type !== 'owner')
          return res.sendStatus(401);
        next();
      });
    });
  } catch (e) {
    return res.sendStatus(401);
  }
};

module.exports = { auth: auth, authAdmin: authAdmin };
