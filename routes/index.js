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
      username: String(req.body.username).toLowerCase(),
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

router.post('/login', (req, res) => {
  // Authenticate the user
  var collection = db.get('users');
  collection.findOne({
    username: req.body.username.toLowerCase()
  }, async (err, user) => {
    if(err) throw err;
    console.log(user.username)
    try {
      if(await bcrypt.compare(req.body.password, user.password_hash)) {
        console.log("Success");
      } else {
        console.log("Not allowed");
      }
    } catch {
      console.log("error");
      res.status(500).send();
    }
  });
  res.redirect('/');
});

module.exports = router;
