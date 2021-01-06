const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult, query } = require('express-validator');

const Account = require('../models/accountModel');
const User = require('../models/userModel');
const Expense = require('../models/expenseModel');

/**
 * Get all accounts
 */
router.get('/', [], (req, res) => {});

/**
 * Create a new account
 */
router.post('/', [], (req, res) => {});

/**
 * Edit an account
 */
router.put('/:account_id', [], (req, res) => {});

/**
 * Delete an account
 */
router.delete('/:account_id', [], (req, res) => {});

module.exports = router;
