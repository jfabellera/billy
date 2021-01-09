const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, authAdmin } = require('./middleware/auth');
const { check, validationResult, query } = require('express-validator');

const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const Group = require('../models/groupModel');

const validateGetExpenses = [
  check('sort', 'Invalid sort option')
    .optional()
    .isIn(['title', 'date', 'amount', 'category', 'user_id']),
  check('direction', 'Invalid direction option')
    .optional()
    .isIn(['asc', 'dsc']),
  check(['start_date', 'end_date'], 'Invalid date format').optional(),
  check('search').optional().isString(),
  check('group_id').optional().isMongoId(),
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

    options.sort.createdAt = '-1';

    // Search
    if (req.query.search) {
      query.title = {
        $regex: new RegExp(req.query.search),
        $options: 'i',
      };
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

    // Group
    if (req.query.group_id) {
      query.group_id = req.query.group_id;
    }

    // handle username
    if (req.params.username) {
      query.user_id = req.user._id;
    }

    // Get TOTAL number of documents that match query excluding per_page and page
    Expense.countDocuments(query, (err, count) => {
      if (err) throw err;

      Expense.aggregate(
        [
          {
            $match: query,
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: '$amount',
              },
            },
          },
        ],
        (err, result) => {
          if (err) throw err;
          let totalAmount = 0;
          if (typeof result[0] !== 'undefined') totalAmount = result[0].total;

          // Return matching documents and total
          Expense.find(query, null, options, (err, expenses) => {
            if (err) throw err;
            res.status(200).json({
              total: count,
              totalAmount: totalAmount,
              expenses: expenses,
            });
          });
        }
      );
    });
  }
};

const validateGetExpenseCategories = [
  check('start_date').optional().isDate(),
  check('end_date').optional().isDate(),
  check('amounts').optional().isBoolean(),
];

getExpenseCategories = async (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.status(400).json(err.errors);
  } else {
    let query = {};
    if (req.params.username) {
      query.user_id = req.user._id;
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

    Expense.find(query).distinct('category', (err, categories) => {
      if (err) throw err;

      let queries = [];
      if (req.query.amounts && req.query.amounts === 'true') {
        categories.forEach((category) => {
          queries.push(
            Expense.aggregate([
              {
                $match: { user_id: req.user._id, category: category },
              },
              {
                $group: {
                  _id: category,
                  total: {
                    $sum: '$amount',
                  },
                },
              },
            ]).exec()
          );
        });
      }
      Promise.all(queries).then((results) => {
        let categoryObjArray;
        if (results.length > 0)
          categoryObjArray = results.map((result) => {
            return {
              name: result[0]._id,
              total: result[0].total,
            };
          });
        else
          categoryObjArray = categories.map((category) => {
            return { name: category };
          });

        res.status(200).json({ categories: categoryObjArray });
      });
    });
  }
};

// Get all expenses
router.get('/', authAdmin, validateGetExpenses, getExpenses);

// Get all expense categories
router.get(
  '/categories',
  authAdmin,
  validateGetExpenseCategories,
  getExpenseCategories
);

// Get details of a single expense
router.get(
  '/:expense_id',
  auth,
  [check('expense_id', 'Invalid expense ID').isMongoId()],
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
  auth,
  [
    check('user_id', 'User ID must be an ObjectID').isMongoId(),
    check('title', 'Title is required').notEmpty().isString(),
    check('amount', 'Amount must be a float').isFloat(),
    check('date', 'Incorrect date format').isDate(),
    check('category').notEmpty().isString(),
    check('group_id').optional().isMongoId(),
    check('description').optional().isString(),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      let query = {
        user_id: mongoose.Types.ObjectId(req.body.user_id),
        title: req.body.title,
        amount: req.body.amount,
        date: req.body.date,
        category: req.body.category,
      };
      if (!req.body.group_id && req.user.default_group_id)
        query.group_id = req.user.default_group_id;
      else if (req.body.group_id) query.group_id = req.body.group_id;
      if (req.body.description) query.description = req.body.description;
      Expense.create(query, (err) => {
        if (err) throw err;
        res.status(201).json({ message: 'Expense created' });
      });
    }
  }
);

// Edit an expense
router.put(
  '/:expense_id',
  auth,
  [
    check('expense_id', 'Expense ID must be an ObjectID').isMongoId(),
    check('title', 'Title is required').optional().notEmpty().isString(),
    check('amount', 'Amount must be a float').optional().isFloat(),
    check('date', 'Incorrect date format').optional().isDate(),
    check('category').optional().notEmpty().isString(),
    check('group_id').optional().isMongoId(),
    check('description').optional().isString(),
  ],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.findOneAndUpdate(
        { _id: req.params.expense_id },
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
  '/:expense_id',
  auth,
  [check('expense_id', 'Expense ID must be an ObjectID').isMongoId()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
      res.status(400).json(err.errors);
    } else {
      Expense.findOneAndDelete(
        { _id: req.params.expense_id },
        (err, expense) => {
          if (err) throw err;
          if (!expense) res.status(400).json({ message: 'Expense not found' });
          else res.status(200).json({ message: 'Expense deleted' });
        }
      );
    }
  }
);

module.exports = {
  router: router,
  validateGetExpenses: validateGetExpenses,
  getExpenses: getExpenses,
  validateGetExpenseCategories: validateGetExpenseCategories,
  getExpenseCategories: getExpenseCategories,
};
