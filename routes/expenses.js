var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var Expense = require("../models/expenseModel");

// display summary page
router.get("/", async function (req, res, next) {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }

  if (req.body.num_results)
    req.session.num_results = parseInt(req.body.num_results);
  if (req.body.month) req.session.month = parseInt(req.body.month);

  var total = 0;
  var pageInfo = {};

  var query = {
    user_id: mongoose.Types.ObjectId(req.session.user._id),
  };
  if (req.query.search) {
    query.title = {
      $regex: new RegExp(req.query.search),
      $options: "i",
    };
    pageInfo.search = req.query.search;
  }
  if (req.session.month != 0) {
    query.date = {
      $gte: new Date(2020, req.session.month - 1, 1),
      $lt: new Date(2020, req.session.month, 1),
    };
  }

  pageInfo.numResults = req.session.num_results;
  pageInfo.currentPage = req.query.page ? req.query.page : 1;

  await Expense.countDocuments(query, async (err, cnt) => {
    pageInfo.totalResults = cnt;
    pageInfo.totalPages = Math.ceil(parseFloat(cnt / pageInfo.numResults));

    if (req.query.page > pageInfo.totalPages || req.query.page < 1) {
      res.redirect("/expenses");
      return;
    }

    // for custom page numbers at bottom of screen
    pageInfo.pageNumbers = {};
    if (pageInfo.currentPage < 5) {
      pageInfo.pageNumbers.low = 2;
      pageInfo.pageNumbers.high = Math.min(5, pageInfo.totalPages - 1);
    } else if (pageInfo.currentPage > pageInfo.totalPages - 4) {
      pageInfo.pageNumbers.low = pageInfo.totalPages - 4;
      pageInfo.pageNumbers.high = pageInfo.totalPages - 1;
    } else {
      pageInfo.pageNumbers.low = parseInt(pageInfo.currentPage) - 1;
      pageInfo.pageNumbers.high = parseInt(pageInfo.currentPage) + 1;
    }

    Expense.aggregate(
      [
        {
          $match: query,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ],
      (err, result) => {
        if (err) throw err;
        if (typeof result[0] !== "undefined") total = result[0].total;

        Expense.find(
          query,
          null,
          {
            sort: {
              date: -1,
            },
            skip: (req.query.page - 1) * req.session.num_results,
            limit: req.session.num_results,
          },
          (err, expenses) => {
            if (err) throw err;
            res.render("user/summary", {
              session: req.session,
              expenses: expenses,
              total: total,
              pageInfo: pageInfo,
            });
          }
        );
      }
    );
  });
});

// Add new expense
router.post("/", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  var date = new Date(req.body.date);
  Expense.create({
    user_id: mongoose.Types.ObjectId(req.session.user._id),
    title: req.body.title,
    category: req.body.category,
    date: date,
    amount: parseFloat(req.body.amount),
  });
  res.redirect("/");
});

// Edit expense
router.put("/:id", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  console.log(req.params.id);
  var date = new Date(req.body.date);
  Expense.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        title: req.body.title,
        amount: parseFloat(req.body.amount),
        date: date,
        category: req.body.category,
      },
    },
    (err) => {
      if (err) throw err;
    }
  );
});

// Delete expense
router.delete("/:id", (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/");
    return;
  }
  Expense.findOneAndDelete(
    {
      _id: req.params.id,
    },
    (err) => {
      if (err) throw err;
    }
  );
});

module.exports = router;
