var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var mongoUtil = require('../mongoUtil.js');
var monk = require('monk');

var db = mongoUtil.getDb();

// display summary page
router.get('/', async function(req, res, next) {
  if(req.body.num_results)
    req.session.num_results = parseInt(req.body.num_results);

  var collection = db.get('expenses');
  var total = 0;
  var pageInfo = {};

  var query = {user_id: monk.id(req.session.user._id)};
  if(req.query.search) {
    query.title = { $regex: new RegExp(req.query.search), $options: 'i'};
    pageInfo.search = req.query.search;
  }

  pageInfo.numResults = req.session.num_results;
  pageInfo.currentPage = req.query.page ? req.query.page : 1;

  await collection.count(query, (err, cnt) => {
    pageInfo.totalResults = cnt;
    pageInfo.totalPages = Math.ceil(parseFloat(cnt / pageInfo.numResults));

    if(req.query.page > pageInfo.totalPages || req.query.page < 1) {
      res.redirect('/expenses');
      return;
    }
  });

  await collection.find(query,
  { sort: { date: -1 }, skip: ((req.query.page-1) * req.session.num_results),
  limit: req.session.num_results }, (err, expenses) => {
    console.log(pageInfo);
    if(err) throw err;
    expenses.forEach(element => {
        total += parseFloat(element.amount);
    });
    res.render('user/summary', { session: req.session, expenses: expenses, total: total, pageInfo: pageInfo });
  });
});

router.post('/', (req, res, next) => {
    var collection = db.get('expenses');
    collection.insert({
        user_id: monk.id(req.session.user._id),
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
