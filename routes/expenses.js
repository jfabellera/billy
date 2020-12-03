var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var dotenv = require('dotenv');

var monk = require('monk');
dotenv.config();
var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');


// display summary page
router.get('/', function(req, res, next) {
    var collection = db.get('expenses');
    collection.find({}, {user_id: req.session.user._id}, (err, expenses) => {
      if(err) throw err;
      res.render('user/summary', { session: req.session, expenses: expenses });
    });
  });
// router.get('/', (req, res) => res.send('Hello'));


module.exports = router;