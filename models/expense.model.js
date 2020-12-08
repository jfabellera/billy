const mongoose = require("mongoose");
const Schema = mongoose.SchemaType;

const expenseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    date: {
      type: Date,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
