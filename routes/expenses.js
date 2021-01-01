const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult, query } = require('express-validator');

const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

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
      } else resolve();
    }).then(() => {
      // Get TOTAL number of documents that match query excluding per_page and page
      Expense.countDocuments(query, (err, count) => {
        if (err) throw err;

        // Return matching documents and total
        Expense.find(query, null, options, (err, expenses) => {
          if (err) throw err;
          res.status(200).json({ total: count, expenses: expenses });
        });
      });
    });
  }
};

getExpenseCategories = async (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json(err.errors);
  } else {
    let query = {};
    new Promise((resolve) => {
      if (req.params.username) {
        User.findOne({ username: req.params.username }, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
          } else query.user_id = user._id;
          resolve();
        });
      } else resolve();
    }).then(() => {
      Expense.find(query).distinct('category', (err, categories) => {
        if (err) throw err;
        res.status(200).json(categories);
      });
    });
  }
};

// Get all expenses
router.get('/', validateGetExpenses, getExpenses);

// Get all expense categories
router.get('/categories', getExpenseCategories);

// Get details of a single expense
router.get(
  '/:id',
  [check('id', 'Invalid expense ID').isMongoId()],
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
router.post(
  '/',
  [
    check('user_id', 'User ID must be an ObjectID').isMongoId(),
    check('title', 'Title is required').notEmpty(),
    check('amount', 'Amount must be a float').isFloat(),
    check('date', 'Incorrect date format').isDate(),
    check('category').optional(),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.create(
        {
          user_id: mongoose.Types.ObjectId(req.body.user_id),
          title: req.body.title,
          amount: req.body.amount,
          date: req.body.date,
          category: req.body.category,
        },
        (err) => {
          if (err) throw err;
          res.status(201).json({ message: 'Expense created' });
        }
      );
    }
  }
);

// Edit an expense
router.put(
  '/:id',
  [
    check('id', 'Expense ID must be an ObjectID').isMongoId(),
    check('title', 'Title is required').optional().notEmpty(),
    check('amount', 'Amount must be a float').optional().isFloat(),
    check('date', 'Incorrect date format').optional().isDate(),
    check('category').optional(),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        (err, expense) => {
          if (err) throw err;
          if (!expense) res.status(400).json({ message: 'Expense not found' });
          else res.status(200).json({ message: 'Expense updated' });
        }
      );
    }
  }
);

// Delete an expense
router.delete(
  '/:id',
  [check('id', 'Expense ID must be an ObjectID').isMongoId()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.findOneAndDelete({ _id: req.params.id }, (err, expense) => {
        if (err) throw err;
        if (!expense) res.status(400).json({ message: 'Expense not found' });
        else res.status(200).json({ message: 'Expense deleted' });
      });
    }
  }
);

module.exports = {
  router: router,
  validateGetExpenses: validateGetExpenses,
  getExpenses: getExpenses,
  getExpenseCategories: getExpenseCategories,
};
