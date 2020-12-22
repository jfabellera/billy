const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

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

// Get list of users
router.get("/", getUsers, (req, res) => {
  res.status(200).json(req.users);
});

// Create new user
router.post("/", async (req, res) => {
  try {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    User.create(
      {
        username: String(req.body.username).toLowerCase(),
        password_hash: hashedPassword,
        name: {
          first: req.body.firstName,
          last: req.body.lastName,
        },
        account_type: req.body.account_type,
        disabled: false,
      },
      function (err) {
        // new user created
        if (err) {
          if (err.code === 11000)
            // User already exists
            res.status(409).json({ error: "Username taken" });
          else throw err;
        } else res.status(201).json({ message: "User created" });
      }
    );
  } catch {
    res.status(500).send();
  }
});

// Edit user
router.put("/:id", async (req, res) => {
  try {
    if (req.body.password) {
      req.body.password_hash = await bcrypt.hash(req.body.password, 10);
      delete req.body["password"];
    }

    User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      (err, user) => {
        if (err) {
          if (err.code === 11000)
            res.status(409).json({ message: "Username taken" });
          else throw err;
        } else if (!user) res.status(200).json({ message: "User not found" });
        else res.status(200).json({ message: "User updated" });
      }
    );
  } catch {
    res.status(500).send();
  }
});

// Delete user
router.delete("/:id", (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      disabled: true,
    },
    (err, user) => {
      if (err) throw err;
      if (!user) res.status(200).json({ message: "User not found" });
      else res.status(200).json({ message: "User deleted" });
    }
  );
});

module.exports = router;
