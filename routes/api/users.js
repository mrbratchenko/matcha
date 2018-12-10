const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
// const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Test users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users works!" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.collection("users")
    .findOne({ email: { $eq: req.body.email } })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200", // size
          r: "pg", // rating
          d: "mm" // default
        });
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          avatar: avatar,
          password: req.body.password
        };
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            db.collection("users")
              .insertOne(newUser)
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/login
// @desc    Login User Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  db.collection("users")
    .findOne({ email: { $eq: email } })
    .then(user => {
      // check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }

      // check password
      bcrypt.compare(password, user.password).then(match => {
        if (match) {
          // user matched
          const payload = {
            id: user._id,
            name: user.name,
            avatar: user.avatar
          };

          // sign token
          jwt.sign(payload, keys.signKey, { expiresIn: 7200 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => console.log(err));
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  }
);
module.exports = router;
