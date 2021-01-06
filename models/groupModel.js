const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema(
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

const Group = mongoose.model('groups', groupSchema);

module.exports = Group;
