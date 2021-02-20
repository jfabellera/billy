const express = require('express');
const router = express.Router();
const { auth, authAdmin } = require('./middleware/auth');
const { check, validationResult } = require('express-validator');

const Group = require('../models/groupModel');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

const removeTimeZoneOffset = (inputDate) => {
  const date = new Date(inputDate);
  const serverTimezonOffset = date.getTimezoneOffset() * 60000;
  const utcDate = new Date(date.getTime() - serverTimezonOffset);
  return utcDate;
};

const getGroups = (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json(err.errors);

  let query = {};
  if (req.params.username) query.user_id = req.user._id;

  Group.find(query, null, { sort: { name: 1 } }, (err, groups) => {
    if (err) throw err;
    res.status(200).json({
      groups: groups.map((group) => {
        return {
          ...group.toObject(),
          default: String(group._id) === String(req.user.default_group_id),
        };
      }),
      default_group_id: req.user.default_group_id,
    });
  });
};

const validateGetExpenseGroups = [
  check('start_date').optional().isDate(),
  check('end_date').optional().isDate(),
  check('amounts').optional().isBoolean(),
];

const getExpenseGroups = async (req, res) => {
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
      query.date.$gte = removeTimeZoneOffset(
        new Date(req.query.start_date).setHours(0, 0, 0)
      );
    }

    if (req.query.end_date) {
      if (!query.date) query.date = {};
      query.date.$lte = removeTimeZoneOffset(
        new Date(req.query.end_date).setHours(23, 59, 59)
      );
    }

    Expense.find(query).distinct('group_id', (err, group_ids) => {
      if (err) throw err;

      let queries = [];
      if (req.query.amounts && req.query.amounts === 'true') {
        group_ids.forEach((group_id) => {
          queries.push(
            Expense.aggregate([
              {
                $match: { ...query, group_id: group_id },
              },
              {
                $group: {
                  _id: group_id,
                  total: {
                    $sum: '$amount',
                  },
                },
              },
            ]).exec()
          );
        });
      }

      Group.find({ user_id: req.user._id }, (err, groups) => {
        if (err) throw err;
        Promise.all(queries).then((results) => {
          let groupObjArray;
          if (results.length > 0)
            groupObjArray = results
              .map((result) => {
                const group = groups.filter((group) =>
                  group._id.equals(result[0]._id)
                )[0];

                return {
                  _id: result[0]._id,
                  name: group ? group.name : '',
                  total: result[0].total,
                };
              })
              .filter((result) => result.name);
          else
            groupObjArray = group_ids.map((group_id) => {
              return { _id: group_id };
            });
          res.status(200).json({ groups: groupObjArray });
        });
      });
    });
  }
};

/**
 * Get all groups
 */
router.get('/', authAdmin, getGroups);

/**
 * Create a new group
 */
router.post(
  '/',
  auth,
  [check('user_id').isMongoId(), check('name').notEmpty().isString()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Group.create(
      {
        user_id: req.body.user_id,
        name: req.body.name,
      },
      (err, group) => {
        if (err) {
          if (err.code === 11000)
            res.status(409).json({ message: 'Group name already exists' });
          else throw err;
        }
        if (!req.user.default_group_id) {
          // make the created group the default for the user if they do not have a default
          User.findOneAndUpdate(
            { _id: group.user_id },
            { default_group_id: group._id },
            (err) => {
              if (err) throw err;
              res.status(200).json({ _id: group._id });
            }
          );
        } else {
          res.status(200).json({ _id: group._id });
        }
      }
    );
  }
);

/**
 * Edit a group
 */
router.put(
  '/:group_id',
  auth,
  [check('group_id').isMongoId(), check('name').isString()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Group.findOneAndUpdate(
      { _id: req.params.group_id },
      req.body,
      (err, group) => {
        if (err) {
          if (err.code === 11000)
            res.status(409).json({ message: 'Group name already exists' });
          else throw err;
        }
        if (!group) return res.sendStatus(500);
        res.sendStatus(200);
      }
    );
  }
);

/**
 * Delete an group
 */
router.delete(
  '/:group_id',
  auth,
  [check('group_id').isMongoId()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Group.findOneAndDelete({ _id: req.params.group_id }, (err, group) => {
      if (err) throw err;
      if (!group) return res.sendStatus(500);
      if (
        req.user.default_group_id &&
        String(req.user.default_group_id) === String(group._id)
      ) {
        Group.find({ user_id: group.user_id }, (err, groups) => {
          if (err) throw err;
          let defaultQuery;
          if (groups.length > 0) {
            // set first result as default group
            defaultQuery = { default_group_id: groups[0]._id };
          } else {
            // remove default group from user
            defaultQuery = { $unset: { default_group_id: 1 } };
          }

          User.findOneAndUpdate({ _id: group.user_id }, defaultQuery, (err) => {
            if (err) throw err;
            res.sendStatus(200);
          });
        });
      } else {
        res.sendStatus(200);
      }
    });
  }
);

module.exports = {
  router,
  getGroups,
  validateGetExpenseGroups,
  getExpenseGroups,
};
