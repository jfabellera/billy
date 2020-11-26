var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/billy');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/index');
});

router.get('/index', function(req, res) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login')
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', async (req, res) => {
  try {
    var collection = db.get('users');
    var hashedPassword = await bcrypt.hash(req.body.password, 10);
    collection.insert({
      username: req.body.username,
      email: req.body.email,
      password_hash: hashedPassword,
      name: {
        first: req.body.firstName,
        middle: req.body.MI,
        last: req.body.lastName
      },
      phone_number: req.body.phone,
      account_type: "user"
    }, function(err, user) {
      // something
    });
  } catch {
    res.status(500).send();
  }
  res.redirect('/');
});
module.exports = router;
