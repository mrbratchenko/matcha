const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // generate user token
const keys = require("../../config/keys");
const passport = require("passport"); // verify user's token
var nodemailer = require("nodemailer");

// Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateResetInput = require("../../validation/reset");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  db.collection("profiles")
    .findOne({
      $or: [
        { email: { $eq: req.body.email } },
        { username: { $eq: req.body.username } }
      ]
    })
    .then(user => {
      if (user && user.email === req.body.email) {
        errors.email = "User with this email already exists";
      }
      if (user && user.username === req.body.username) {
        errors.username = "This username is already taken";
      }
      if (Object.keys(errors).length > 0 || !isValid) {
        return res.status(400).json(errors);
      }
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        ifVerified: false,
        verificationCode: req.body.email
      };

      bcrypt.hash(newUser.verificationCode, 10, (err, hash) => {
        if (err) throw err;
        newUser.verificationCode = hash;
        bcrypt.hash(newUser.password, 10, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          db.collection("users")
            .insertOne(newUser)
            .then(user => {
              res.json(user);
              db.collection("profiles")
                .insertOne({ user: user.insertedId })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));

          // Sending activation email
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: keys.mailerUser,
              pass: keys.mailerPass
            }
          });
          var mailOptions = {
            from: "matches@gmail.com",
            to: "agent.tony.white@gmail.com", // req.body.email,
            subject: "Please activate your Matches account",
            text:
              "Hello " +
              newUser.name +
              "!\n" +
              "Please follow the link below to activate your account:\n" +
              "http://localhost:3000/activation?email=" +
              newUser.email +
              "&code=" +
              newUser.verificationCode +
              "\n- Matcha team.  "
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        });
      });
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
          if (user && user.ifVerified === false) {
            errors.verification =
              "User email has not been confirmed. Please check your email.";
            return res.status(400).json(errors);
          }
          // user matched
          const payload = {
            id: user._id,
            name: user.name,
            username: user.username
          };
          // sign token
          jwt.sign(payload, keys.jwtKey, { expiresIn: 7200 }, (err, token) => {
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

// @route   POST api/users/activation/:email/:code
// @desc    Activate user's account with email code
// @access  Public
router.post("/activation", (req, res) => {
  const email = req.body.email;
  const code = req.body.code;

  // console.log(email);
  // console.log(code);
  const errors = {};
  // find user by email
  db.collection("users")
    .findOne({
      $and: [{ email: { $eq: email } }, { verificationCode: { $eq: code } }]
    })
    .then(user => {
      if (user && user.ifVerified === true) {
        errors.activation = "This account has already been activated.";
        return res.status(400).json(errors);
      } else if (user && user.ifVerified === false) {
        console.log(user);
        db.collection("users")
          .findOneAndUpdate({ email: email }, { $set: { ifVerified: true } })
          .then(user => res.json(user));
        errors.emailSent =
          "An account activation email has been sent to your address.";
      } else {
        errors.activation = "Something went wrong. Please try again later.";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/activation/:email/:code
// @desc    Reset user's password with email code
// @access  Public
router.post("/reset-password", (req, res) => {
  const { errors, isValid } = validateResetInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  console.log(email);

  // find user by email
  db.collection("profiles")
    .findOne({ email: { $eq: email } })
    .then(profile => {
      // check for user
      if (!profile) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }
      db.collection("users")
        .findOne({ _id: { $eq: profile.user } })
        .then(user => {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: keys.mailerUser,
              pass: keys.mailerPass
            }
          });
          var mailOptions = {
            from: "matches@gmail.com",
            to: "agent.tony.white@gmail.com", // req.body.email,
            subject: "A link to reset your password",
            text:
              "Hello " +
              profile.name +
              "!\n" +
              "Please follow the link below to reset your password:\n" +
              "http://localhost:3000/reset-password?email=" +
              profile.email +
              "&code=" +
              user.verificationCode +
              "\n- Matcha team.  "
          };
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        })
        .catch(err => console.log(err));
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
