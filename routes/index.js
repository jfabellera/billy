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

    // check if user exists already
    collection.findOne({
      username: req.body.username.toLowerCase()
    }, (err, user) => {
      if(req.body.email.toLowerCase() == req.body.confirmEmail.toLowerCase() &&
          req.body.password == req.body.confirmPassword && user == null) {
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
          // new user created
          res.redirect('/');
        });
      } else {
        console.log("Registration failed");
      }
    });

  } catch {
    res.status(500).send();
  }
});

router.post('/login', (req, res) => {
  // Authenticate the user
  var collection = db.get('users');
  collection.findOne({
    username: req.body.username.toLowerCase()
  }, async (err, user) => {
    if(err) throw err;
    try {
      if(user != null && await bcrypt.compare(req.body.password, user.password_hash)) {
        console.log("Success");
        res.redirect('/');
      } else {
        console.log("Not allowed");
        res.render('login', { error: "invalid", formData: req.body });
      }
    } catch {
      console.log("error");
      res.status(500).send();
    }
  });
});

module.exports = router;
