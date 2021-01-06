const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, authAdmin } = require('./middleware/auth');
const { check, validationResult, query } = require('express-validator');

const Group = require('../models/groupModel');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

getGroups = (req, res) => {
  let err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json(err.errors);

  let query = {};
  if (req.params.username) query.user_id = req.user._id;

  Group.find(query, (err, groups) => {
    if (err) throw err;
    res.status(200).json({ groups: groups });
  });
};

/**
 * Get all groups
 */
router.get('/', authAdmin,  getGroups);

/**
 * Create a new group
 */
router.post(
  '/',
  auth,
  [check('user_id').isMongoId(), check('name').isString()],
  (req, res) => {
    let err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json(err.errors);

    Group.create(
      {
        user_id: req.body.user_id,
        name: req.body.name,
      },
      (err, group) => {
        if (err) throw err;
        res.sendStatus(200);
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
      { name: req.body.name },
      (err, group) => {
        if (err) throw err;
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
      res.sendStatus(200);
    });
  }
);

module.exports = { router: router, getGroups: getGroups };
