var express = require('express');
var router = express.Router();

var monk = require('monk');
// var db = monk('localhost:27017/billy');

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

module.exports = router;
