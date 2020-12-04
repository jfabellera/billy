var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var dotenv = require('dotenv');

var monk = require('monk');
dotenv.config();
var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');

function getUsers(req, res, next) {
  var collection = db.get('users');
  collection.find({}, { sort: { username: 1 } }, (err, users) => {
    if(err) throw err;
    req.users = users;
    next();
  });
}

/* GET users listing. */
router.get('/', getUsers, (req, res) => {
  if(req.session.user && req.session.user.account_type == "admin") {
    res.render('admin/users', { session: req.session, users: req.users });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// add new account from admin page
router.post('/', getUsers, async (req, res) => {
  try {
    var collection = db.get('users');
    var hashedPassword = await bcrypt.hash(req.body.password, 10);

    // check if user exists already
    collection.findOne({
      username: req.body.username.toLowerCase()
    }, (err, user) => {
      if(user != null) {
        res.render('admin/users', { error: "taken", formData: req.body, session: req.session, users: req.users });
      } else if(req.body.password != req.body.confirmPassword) {
        res.render('admin/users', { error: "passwordMismatch", formData: req.body, session: req.session, users: req.users });
      } else {
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
          account_type: req.body.account_type,
          disabled: false
        }, function(err, user) {
          // new user created
          res.redirect('/users');
        });
      }
    });

  } catch {
    res.status(500).send();
  }
});

// edit users on admin page
router.put('/', (req, res, next) => {
  var collection = db.get('users');
  req.body.forEach((user) => {
    collection.update({ _id: user._id }, { $set: {
      username: user.username,
      account_type: user.account_type,
      disabled: user.disabled
    }});
  });
  res.send({ redirect: '/users'});
});

// edit individual user from account page
router.put('/:id', async (req, res, next) => {
  try {
    var collection = db.get('users');
    var hashedPassword = req.session.user.password_hash;
    var validOldPassword = await bcrypt.compare(req.body.oldPassword, req.session.user.password_hash);
    if(req.body.newPassword) {
      if(req.body.newPassword == req.body.confirmNewPassword && validOldPassword) {
        hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      } else if(!validOldPassword) {
        // invalid old password
        res.render('user/account', { error: 'invalid', formData: req.body, session: req.session });
        return;
      } else {
        // new passwords don't match
        res.render('user/account', { error: 'mismatch', formData: req.body, session: req.session });
        return
      }
    }

    // check if user is not taken and is not empty
    collection.findOne({
      username: req.body.username.toLowerCase()
    }, (err, user) => {
      if(!user || user._id == req.session.user._id) {
        collection.update({
          _id: req.session.user._id
        }, { $set: {
          name: {
            first: req.body.firstName,
            middle: req.body.MI,
            last: req.body.lastName
          },
          username: req.body.username.toLowerCase(),
          phone_number: req.body.phone,
          email: req.body.email,
          password_hash: hashedPassword
        }}, function() {
          collection.findOne({
            _id: req.session.user._id
          }, (err, user) => {
            req.session.user = user;
            res.render('user/account', { ack: 'success', session: req.session });
          });
        });
      } else {
        res.render('user/account', { error: 'taken', formData: req.body, session: req.session });
      }
    });
  } catch {
    res.status(500).send();
  }
});

router.delete('/:id', (req, res, next) => {
  var collection = db.get('users');
  collection.update({
    _id: req.session.user._id
  }, { $set: {
    disabled: true
  }});
  res.redirect("/logout");
});
module.exports = router;
