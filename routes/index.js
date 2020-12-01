var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var dotenv = require('dotenv');

var monk = require('monk');
dotenv.config();
var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user)
    res.redirect('/summary');
  else
    res.redirect('/index');
});

router.get('/index', function(req, res) {
  res.render('index', { session: req.session });
});

router.get('/login', function(req, res) {
  if(req.session.user) {
    res.redirect('/');
    return;
  }
  res.render('login', { session: req.session })
});

router.get('/logout', function(req, res) {
  if(req.session.user)
    req.session.user = null;
  res.redirect('/');
});

router.get('/register', function(req, res) {
  if(req.session.user) {
    res.redirect('/');
    return;
  }
  res.render('register', { session: req.session });
});

router.get('/about', (req, res) => {
    res.render('about/about', { session: req.session })
});

router.get('/about/terms', (req, res) => {
  res.render('about/terms', { session: req.session });
});

router.get('/forgot', function(req, res) {
  res.render('forgot', { session: req.session });
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
          account_type: "user",
          disabled: false
        }, function(err, user) {
          // new user created
          req.session.user = user;
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
        req.session.user = user;
        res.redirect('/');
      } else {
        console.log("Not allowed");
        res.render('login', { error: "invalid", formData: req.body, session: req.session });
        res.status(401).send();
      }
    } catch {
      console.log("error");
      res.status(500).send();
    }
  });
});


router.get('/summary', (req, res) => {
  if(!req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/summary', { session: req.session })
    // TODO
  }
});

router.get('/profile', (req, res) => {
  if(!req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/profile', { session: req.session })
    // TODO
  }
});

router.get('/settings', (req, res) => {
  if(!req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/settings', { session: req.session })
    // TODO
  }
});

router.put('/users/:id', (req, res) => {
  var collection = db.get('users');

  collection.update({
    _id: req.params.id
  },
  { $set: {
    username: String(req.body.username).toLowerCase(),
    email: req.body.email,
    name: {
      first: req.body.firstName,
      middle: req.body.MI,
      last: req.body.lastName
    },
    phone_number: req.body.phone,
  }}, function(err, user) {
    if (err) throw err;
      res.redirect("/settings");
  });
});


module.exports = router;
