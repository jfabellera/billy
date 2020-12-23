const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('expenses', expenseSchema);

module.exports = Expense;
