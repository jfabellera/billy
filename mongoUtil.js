var monk = require('monk');
var dotenv = require('dotenv');
dotenv.config();

var _db;

module.exports = {
  connect: function() {
    _db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');
  },
  getDb: function() {
    return _db;
  }
};
