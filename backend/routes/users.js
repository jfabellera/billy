const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth, authAdmin } = require('./middleware/auth');
const { check, validationResult } = require('express-validator');
const {
  validateGetExpenses,
  getExpenses,
  validateGetExpenseCategories,
  getExpenseCategories,
} = require('./expenses');
const {
  getGroups,
  validateGetExpenseGroups,
  getExpenseGroups,
} = require('./groups');

const config = require('../config');

const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

// Get list of users
router.get(
  '/',
  authAdmin,
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
  auth,
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
    check('username', 'Username is required').exists().isAlphanumeric(),
    check('password', 'Password is required').exists(),
    check('name').customSanitizer((name) => {
      let newName = { first: '', last: '' };
      if (name.first) newName.first = name.first;
      if (name.last) newName.last = name.last;
      return newName;
    }),
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
            name: req.body.name,
            account_type: 'user',
            disabled: false,
          },
          (err, user) => {
            // new user created
            if (err) {
              if (err.code === 11000)
                // User already exists
                res.status(409).json({ error: 'Username taken' });
              else throw err;
            } else {
              res.status(201).json({ message: 'User created' });
            }
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
  '/:user_id',
  auth,
  [check('user_id', 'Invalid user ID').isMongoId()],
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

        if (req.body.name) {
          if (req.body.name.first) req.body['name.first'] = req.body.name.first;
          if (req.body.name.last) req.body['name.last'] = req.body.name.last;
          delete req.body['name'];
        }

        if (req.body.account_type) {
          delete req.body['account_type'];
        }

        if (req.body.disabled) {
          delete req.body['disabled'];
        }

        User.findOneAndUpdate(
          {
            _id: req.params.user_id,
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
  '/:user_id',
  auth,
  [check('user_id', 'Invalid user ID').isMongoId()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      User.findOneAndUpdate(
        {
          _id: req.params.user_id,
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
  auth,
  [check('username', 'Invalid username').isAlphanumeric()],
  validateGetExpenses,
  getExpenses
);

// Get categories of expenses from a single user
router.get(
  '/:username/expenses/categories',
  auth,
  [check('username').isAlphanumeric()],
  validateGetExpenseCategories,
  getExpenseCategories
);

router.get(
  '/:username/groups',
  auth,
  [check('username').isAlphanumeric()],
  getGroups
);

router.get(
  '/:username/expenses/groups',
  auth,
  validateGetExpenseGroups,
  getExpenseGroups
);

module.exports = router;
