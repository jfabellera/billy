var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();

const User = require("../models/userModel");

function getUsers(req, res, next) {
  User.find(
    {},
    null,
    {
      sort: {
        username: 1,
      },
    },
    (err, users) => {
      if (err) throw err;
      req.users = users;
      next();
    }
  );
}

/* GET users listing. */
router.get("/", getUsers, (req, res) => {
  if (
    !req.session.user ||
    (req.session.user && req.session.user.account_type != "admin")
  ) {
    res.redirect("/");
    return;
  }

  res.render("admin/users", {
    session: req.session,
    users: req.users,
  });
});

// Add new account from admin page
router.post("/", getUsers, async (req, res) => {
  if (
    !req.session.user ||
    (req.session.user && req.session.user.account_type != "admin")
  ) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    var hashedPassword = await bcrypt.hash(req.body.password, 10);

    // check if user exists already
    User.findOne(
      {
        username: req.body.username.toLowerCase(),
      },
      (err, user) => {
        if (user != null) {
          res.render("admin/users", {
            error: "taken",
            formData: req.body,
            session: req.session,
            users: req.users,
          });
        } else if (req.body.password != req.body.confirmPassword) {
          res.render("admin/users", {
            error: "passwordMismatch",
            formData: req.body,
            session: req.session,
            users: req.users,
          });
        } else {
          User.create(
            {
              username: String(req.body.username).toLowerCase(),
              email: "",
              password_hash: hashedPassword,
              name: {
                first: "",
                last: "",
              },
              phone_number: "",
              account_type: req.body.account_type,
              disabled: false,
            },
            function (err, user) {
              // new user created
              res.redirect("/users");
            }
          );
        }
      }
    );
  } catch {
    res.status(500).send();
  }
});

// Edit users on admin page
router.put("/", (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user && req.session.user.account_type != "admin")
  ) {
    res.status(401).send("Unauthorized");
    return;
  }

  req.body.forEach((user) => {
    User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        username: user.username,
        account_type: user.account_type,
        disabled: user.disabled,
      },
      (err, user) => {
        if (err) throw err;
      }
    );
  });
  res.send({
    redirect: "/users",
  });
});

// Edit individual user from account page
router.put("/:id", async (req, res, next) => {
  if (
    !req.session.user ||
    (req.session.user && req.session.user._id != req.params.id)
  ) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    var hashedPassword = req.session.user.password_hash;
    var validOldPassword = await bcrypt.compare(
      req.body.oldPassword,
      req.session.user.password_hash
    );
    if (req.body.newPassword) {
      if (
        req.body.newPassword == req.body.confirmNewPassword &&
        validOldPassword
      ) {
        hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      } else if (!validOldPassword) {
        // invalid old password
        res.render("user/account", {
          error: "invalid",
          formData: req.body,
          session: req.session,
        });
        return;
      } else {
        // new passwords don't match
        res.render("user/account", {
          error: "mismatch",
          formData: req.body,
          session: req.session,
        });
        return;
      }
    }

    // check if user is not taken and is not empty
    User.findOne(
      {
        username: req.body.username.toLowerCase(),
      },
      (err, user) => {
        if (!user || user._id == req.session.user._id) {
          User.findOneAndUpdate(
            {
              _id: req.session.user._id,
            },
            {
              name: {
                first: req.body.firstName,
                last: req.body.lastName,
              },
              username: req.body.username.toLowerCase(),
              phone_number: req.body.phone,
              email: req.body.email,
              password_hash: hashedPassword,
            },
            () => {
              User.findOne(
                {
                  _id: req.session.user._id,
                },
                (err, user) => {
                  req.session.user = user;
                  res.render("user/account", {
                    ack: "success",
                    session: req.session,
                  });
                }
              );
            }
          );
        } else {
          res.render("user/account", {
            error: "taken",
            formData: req.body,
            session: req.session,
          });
        }
      }
    );
  } catch {
    res.status(500).send();
  }
});

// Delete user
router.delete("/:id", (req, res) => {
  if (
    !req.session.user ||
    (req.session.user && req.session.user._id != req.params.id)
  ) {
    res.status(401).send("Unauthorized");
    return;
  }

  User.findOneAndUpdate(
    {
      _id: req.session.user._id,
    },
    {
      disabled: true,
    },
    (err, user) => {
      if (err) throw err;
    }
  );
  res.redirect("/logout");
});
module.exports = router;
