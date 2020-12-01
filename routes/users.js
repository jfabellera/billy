var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var dotenv = require('dotenv');

var monk = require('monk');
dotenv.config();
var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var collection = db.get('users');
  if(req.session.user && req.session.user.account_type == "admin") {
    collection.find({}, { sort: { name: 1 } }, (err, users) => {
      if(err) throw err;
      res.render('admin/users', { session: req.session, users: users });
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

router.put('/', (req, res, next) => {
  var collection = db.get('users');
  req.body.forEach((user) => {
    collection.update({ _id: user._id }, { $set: {
      username: user.username,
      account_type: user.account_type
    }});
  });
});

router.get('/:id', (req, res, next) => {

});

module.exports = router;
