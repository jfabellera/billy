const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = require('../../models/userModel');
const Expense = require('../../models/expenseModel');
const Group = require('../../models/groupModel');

const auth = (req, res, next) => {
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

        // TODO : use custom sanitizer with express-validator ?
        if (req.params.expense_id)
          queries.push(Expense.findOne({ _id: req.params.expense_id }).exec());
        if (req.params.group_id)
          queries.push(Group.findOne({ _id: req.params.group_id }).exec());
        if (req.body.expense_id)
          queries.push(Expense.findOne({ _id: req.body.expense_id }).exec());
        if (req.body.group_id)
          queries.push(Group.findOne({ _id: req.body.group_id }).exec());
        if (req.body.default_group_id)
          queries.push(
            Group.findOne({ _id: req.body.default_group_id }).exec()
          );

        Promise.all(queries).then((results) => {
          if (results.includes(null)) return res.sendStatus(500);
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

const authAdmin = (req, res, next) => {
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

module.exports = { auth, authAdmin };
