var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
const User = require("../models/userModel");

/* Redirect to summary/landing page */
router.get("/", function (req, res, next) {
  if (req.session.user) res.redirect("/expenses");
  else res.redirect("/index");
});

// Display landing page
router.get("/index", function (req, res) {
  res.render("index", {
    session: req.session,
  });
});

// Display login page
router.get("/login", function (req, res) {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("login", {
    session: req.session,
  });
});

// Logout
router.get("/logout", function (req, res) {
  if (req.session.user) req.session.user = null;
  res.redirect("/");
});

// Display register page
router.get("/register", function (req, res) {
  if (req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("register", {
    session: req.session,
  });
});

// Display about page
router.get("/about", (req, res) => {
  res.render("about/about", {
    session: req.session,
  });
});

// Display terms and conditions
router.get("/about/terms", (req, res) => {
  res.render("about/terms", {
    session: req.session,
  });
});

// Display forgot page
router.get("/forgot", function (req, res) {
  res.render("forgot", {
    session: req.session,
  });
});

// Register a new user to the system
router.post("/register", async (req, res) => {
  try {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);

    // check if user exists already
    User.findOne(
      {
        username: req.body.username.toLowerCase(),
      },
      (err, user) => {
        if (user != null) {
          res.render("register", {
            error: "taken",
            formData: req.body,
            session: req.session,
          });
        } else if (
          req.body.email.toLowerCase() != req.body.confirmEmail.toLowerCase()
        ) {
          res.render("register", {
            error: "emailMismatch",
            formData: req.body,
            session: req.session,
          });
        } else if (req.body.password != req.body.confirmPassword) {
          res.render("register", {
            error: "passwordMismatch",
            formData: req.body,
            session: req.session,
          });
        } else {
          User.create(
            {
              username: String(req.body.username).toLowerCase(),
              email: req.body.email,
              password_hash: hashedPassword,
              name: {
                first: req.body.firstName,
                last: req.body.lastName,
              },
              phone_number: req.body.phone,
              account_type: "user",
              disabled: false,
            },
            (err, user) => {
              // new user created
              req.session.user = user;
              res.redirect("/");
            }
          );
        }
      }
    );
  } catch {
    res.status(500).send();
  }
});

// Login the user and set the session
router.post("/login", (req, res) => {
  // Authenticate the user
  User.findOne(
    {
      username: req.body.username.toLowerCase(),
    },
    async (err, user) => {
      if (err) throw err;
      try {
        if (
          user != null &&
          !user.disabled &&
          (await bcrypt.compare(req.body.password, user.password_hash))
        ) {
          console.log("Success");
          req.session.user = user;
          req.session.num_results = 10;
          req.session.month = 0;
          res.redirect("/");
        } else {
          console.log("Not allowed");
          res.render("login", {
            error: "invalid",
            formData: req.body,
            session: req.session,
          });
          res.status(401).send();
        }
      } catch {
        console.log("error");
        res.status(500).send();
      }
    }
  );
});

// Display account settings page
router.get("/account", (req, res) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    res.render("user/account", {
      session: req.session,
    });
  }
});

module.exports = router;
