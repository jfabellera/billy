var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var dotenv = require('dotenv');

var monk = require('monk');
var mongoose = require('mongoose');

dotenv.config();
var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');


// display summary page
router.get('/', function(req, res, next) {
    var collection = db.get('expenses');
    var total = 0;
    collection.find({}, {user_id: req.session.user._id}, (err, expenses) => {
      if(err) throw err;
      expenses.forEach(element => {
          total += parseFloat(element.amount);
      });
      res.render('user/summary', { session: req.session, expenses: expenses, total:total });
    });
  });
// router.get('/', (req, res) => res.send('Hello'));

router.post('/', (req, res, next) => {
    var collection = db.get('expenses');
    collection.insert({
        user_id: mongoose.Types.ObjectId(req.session.user._id),
        title: req.body.title,
        category: req.body.category,
        date: new Date(req.body.date),
        amount: req.body.amount
    })
    console.log("post expense called");
    // req.session.expense = expense;
    res.redirect('/');
  });

router.delete('/:id', (req, res, next) => {
    console.log("hitting delete");
    console.log(req.params);
    console.log(req.body);
    var collection = db.get('expenses');
    collection.findOneAndDelete({
        _id: req.params.id
    }).then(() => res.redirect("/"));
});

module.exports = router;