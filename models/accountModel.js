const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Not to be confused with Users. Accounts represent 'banking
 * accounts' i.e. if a user wants to track spending across multiple
 * accounts.
 */
const accountSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;
