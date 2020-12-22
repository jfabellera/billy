const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { validateGetExpenses, getExpenses } = require('./expenses');

const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

// Get list of users
router.get(
  '/',
  [
    check('type', 'Invalid account type')
      .optional()
      .isIn(['user', 'admin', 'owner'])
      .not()
      .isArray(),
    check('sort', 'Invalid sort option')
      .optional()
      .isIn(['username', 'age', 'first_name', 'last_name', 'account_type'])
      .not()
      .isArray()
      .customSanitizer((sort) => {
        if (sort === 'age') return 'createdAt';
        if (sort === 'first_name') return 'name.first';
        if (sort === 'last_name') return 'name.last';
      }),
    check('direction', 'Invalid direction option')
      .optional()
      .isIn(['asc', 'dsc'])
      .not()
      .isArray(),
    check('per_page').optional().optional().isInt({ min: 1, max: 100 }),
    check('page').optional().optional().isInt({ min: 1 }),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      let query = {};
      let options = { sort: { username: 1 }, collation: { locale: 'en' } };
      let direction = req.query.direction
        ? req.query.direction === 'asc'
          ? 1
          : -1
        : 1;

      // Account type
      if (req.query.type) {
        query.account_type = req.query.type;
      }

      // Sort
      if (req.query.sort) {
        if (req.query.sort === 'createdAt') direction = -direction;
        options.sort = { [req.query.sort]: direction };
      }

      // Pagination
      if (req.query.per_page) {
        options.limit = parseInt(req.query.per_page);
      }

      if (req.query.page) {
        options.skip = (req.query.page - 1) * options.limit;
      }

      User.find(query, null, options, (err, users) => {
        if (err) throw err;
        res.status(200).json(users);
      });
    }
  }
);

// Get details of a single user
router.get(
  '/:username',
  [check('username', 'Invalid username').isAlphanumeric()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      User.findOne({ username: req.params.username }, (err, user) => {
        if (err) throw err;
        if (!user) res.status(200).json({ message: 'User not found' });
        else res.status(200).json(user);
      });
    }
  }
);

// Create new user
router.post(
  '/',
  [
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        User.create(
          {
            username: String(req.body.username).toLowerCase(),
            password_hash: hashedPassword,
            name: {
              first: req.body.firstName,
              last: req.body.lastName,
            },
            account_type: req.body.account_type,
            disabled: false,
          },
          (err) => {
            // new user created
            if (err) {
              if (err.code === 11000)
                // User already exists
                res.status(409).json({ error: 'Username taken' });
              else throw err;
            } else res.status(201).json({ message: 'User created' });
          }
        );
      } catch {
        res.status(500).send();
      }
    }
  }
);

// Edit user
router.put(
  '/:id',
  [
    check('id', 'Invalid user ID')
      .isHexadecimal()
      .isLength({ min: 24, max: 24 }),
  ],
  async (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      try {
        if (req.body.password) {
          req.body.password_hash = await bcrypt.hash(req.body.password, 10);
          delete req.body['password'];
        }

        User.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          req.body,
          (err, user) => {
            if (err) {
              if (err.code === 11000)
                res.status(409).json({ message: 'Username taken' });
              else throw err;
            } else if (!user)
              res.status(200).json({ message: 'User not found' });
            else res.status(200).json({ message: 'User updated' });
          }
        );
      } catch {
        res.status(500).send();
      }
    }
  }
);

// Delete user
router.delete(
  '/:id',
  [
    check('id', 'Invalid user ID')
      .isHexadecimal()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      User.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          disabled: true,
        },
        (err, user) => {
          if (err) throw err;
          if (!user) res.status(200).json({ message: 'User not found' });
          else res.status(200).json({ message: 'User deleted' });
        }
      );
    }
  }
);

// Get expenses from a single user
router.get(
  '/:username/expenses',
  [check('username', 'Invalid username').isAlphanumeric()],
  validateGetExpenses,
  getExpenses
);

// Get categories of expenses from a single user
router.get(
  '/:username/expenses/categories',
  [check('username').isAlphanumeric()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      User.findOne({ username: req.params.username }, (err, user) => {
        if (err) throw err;
        if (!user) res.status(400).json({ message: 'User not found' });
        else {
          Expense.find({ user_id: user._id }).distinct(
            'category',
            (err, categories) => {
              if (err) throw err;
              res.status(200).json(categories);
            }
          );
        }
      });
    }
  }
);

module.exports = router;
