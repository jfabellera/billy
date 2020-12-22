const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const { resolveInclude } = require('ejs');

const validateGetExpenses = [
  check('sort', 'Invalid sort option')
    .optional()
    .isIn(['title', 'date', 'amount', 'category', 'user_id'])
    .not()
    .isArray(),
  check('direction', 'Invalid direction option')
    .optional()
    .isIn(['asc', 'dsc'])
    .not()
    .isArray(),
  check(['start_date', 'end_date'], 'Invalid date format')
    .optional()
    .not()
    .isArray(),
  check('per_page', 'Invalid number').optional().isInt({ min: 1, max: 100 }),
  check('page', 'Invalid number').optional().isInt({ min: 1 }),
];

getExpenses = async (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json(err.errors);
  } else {
    // Sort order
    let query = {};
    let options = { sort: { date: -1 }, limit: 100 };
    let direction = req.query.direction
      ? req.query.direction === 'asc'
        ? 1
        : -1
      : 1;
    if (req.query.sort) {
      options.sort = { [req.query.sort]: direction };
    }

    // Date range
    if (req.query.start_date) {
      if (!query.date) query.date = {};
      query.date.$gte = new Date(
        new Date(req.query.start_date).setHours(00, 00, 00)
      );
    }

    if (req.query.end_date) {
      if (!query.date) query.date = {};
      query.date.$lte = new Date(
        new Date(req.query.end_date).setHours(23, 59, 59)
      );
    }

    // Pagination
    if (req.query.per_page) {
      options.limit = parseInt(req.query.per_page);
    }

    if (req.query.page) {
      options.skip = (req.query.page - 1) * options.limit;
    }

    new Promise((resolve) => {
      // Handle user  
      if (req.params.username) {
        User.findOne({ username: req.params.username }, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(200).json({ message: 'User not found' });
            return;
          } else query.user_id = user._id;
          resolve();
        });
      } else {
        resolve();
      }
    }).then(() => {
      Expense.find(query, null, options, (err, expenses) => {
        if (err) throw err;
        res.status(200).json(expenses);
      });
    });
  }
};

// Get all expenses
router.get('/', validateGetExpenses, getExpenses);

// Get details of a single expense
router.get(
  '/:id',
  [
    check('id', 'Invalid expense ID')
      .isHexadecimal()
      .isLength({ min: 24, max: 24 }),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.findOne({ _id: req.params.id }, (err, expense) => {
        if (err) throw err;
        if (!expense) res.status(200).json({ message: 'Expense not found' });
        else res.status(200).json(expense);
      });
    }
  }
);

// Create new expense
router.post('/', (req, res) => {});

// Edit an expense
router.put('/:id', (req, res) => {});

// Delete an expense
router.delete('/:id', (req, res) => {});

// Get all expense categories
router.get('/categories', (req, res) => {});

module.exports = {
  router: router,
  validateGetExpenses: validateGetExpenses,
  getExpenses: getExpenses,
};
