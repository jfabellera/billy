const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, authAdmin } = require('./middleware/auth');
const { check, validationResult, query } = require('express-validator');

const Account = require('../models/accountModel');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

getAccounts = (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json(err.errors);

  let query = {};
  if (req.params.username) query.user_id = req.user._id;

  Account.find(query, (err, accounts) => {
    if (err) throw err;
    res.status(200).json({ accounts: accounts });
  });
};

/**
 * Get all accounts
 */
router.get('/', authAdmin,  getAccounts);

/**
 * Create a new account
 */
router.post(
  '/',
  auth,
  [check('user_id').isMongoId(), check('name').isString()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Account.create(
      {
        user_id: req.body.user_id,
        name: req.body.name,
      },
      (err, acc) => {
        if (err) throw err;
        res.sendStatus(200);
      }
    );
  }
);

/**
 * Edit an account
 */
router.put(
  '/:account_id',
  auth,
  [check('account_id').isMongoId(), check('name').isString()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Account.findOneAndUpdate(
      { _id: req.params.account_id },
      { name: req.body.name },
      (err, account) => {
        if (err) throw err;
        if (!account) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  }
);

/**
 * Delete an account
 */
router.delete(
  '/:account_id',
  auth,
  [check('account_id').isMongoId()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Account.findOneAndDelete({ _id: req.params.account_id }, (err, account) => {
      if (err) throw err;
      if (!account) return res.sendStatus(500);
      res.sendStatus(200);
    });
  }
);

module.exports = { router: router, getAccounts: getAccounts };
