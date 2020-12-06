var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoUtil = require('../mongoUtil.js');
var db = mongoUtil.getDb();

var monk = require('monk');
// dotenv.config();
// var db = monk('mongodb+srv://billy:'+process.env.mongodb_password+'@billy.ks9cj.mongodb.net/billy?retryWrites=true&w=majority');


// display summary page
router.get('/', async function(req, res, next) {
    var collection = db.get('expenses');
    var total = 0;

    await collection.find({user_id: monk.id(req.session.user._id)}, { sort: { date: -1 }, skip: ((req.query.page-1) * req.session.num_results), limit: req.session.num_results }, (err, expenses) => {
      if(err) throw err;
      expenses.forEach(element => {
          total += parseFloat(element.amount);
      });
      res.render('user/summary', { session: req.session, expenses: expenses, total: total });
    });
  });

router.post('/', (req, res, next) => {
    var collection = db.get('expenses');
    collection.insert({
        user_id: mongoose.Types.ObjectId(req.session.user._id),
        title: req.body.title,
        category: req.body.category,
        date: new Date(req.body.date),
        amount: req.body.amount
    })
    res.redirect('/');
  });

router.delete('/:id', (req, res, next) => {
    var collection = db.get('expenses');
    collection.findOneAndDelete({
        _id: req.params.id
    }).then(() => {res.end('')})
});

module.exports = router;
