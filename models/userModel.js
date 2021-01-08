const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 1,
    },
    password_hash: {
      type: String,
      required: true,
    },
    name: {
      type: {
        first: {
          type: String,
        },
        last: {
          type: String,
        },
      },
    },
    default_group_id: {
      type: mongoose.Types.ObjectId,
    },
    account_type: {
      type: String,
      lowercase: true,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
