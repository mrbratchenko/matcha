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
const validateEmailInput = require("../../validation/reset-pass");
const validatePassInput = require("../../validation/change-pass");

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
      if (Object.keys(errors).length > 0) {
        return res.status(400).json(errors);
      }
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isVerified: false,
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
    .findOne({ email: req.body.email })
    .then(user => {
      // check for user
      if (!user) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }
      // check password
      bcrypt.compare(password, user.password).then(match => {
        if (match) {
          if (user && user.isVerified === false) {
            errors.verification =
              "This account has not been confirmed. Please check your email.";
            return res.status(400).json(errors);
          }
          // user matched
          const payload = {
            id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar
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

  const errors = {};
  // find user by email
  db.collection("users")
    .findOne({
      $and: [{ email: { $eq: email } }, { verificationCode: { $eq: code } }]
    })
    .then(user => {
      if (user && user.isVerified === true) {
        errors.activation = "This account has already been activated.";
        return res.status(400).json(errors);
      } else if (user && user.isVerified === false) {
        console.log(user);
        db.collection("users")
          .findOneAndUpdate({ email: email }, { $set: { isVerified: true } })
          .then(user => res.json(user));
      } else {
        errors.activation = "Something went wrong. Please try again later.";
        return res.status(400).json(errors);
      }
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/reset-password
// @desc    Send email to reset user's password
// @access  Public
router.post("/reset-password", (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateEmailInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  db.collection("users")
    .findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        errors.email = "This email is not registered.";
        return res.status(400).json(errors);
      }
      res.json(user);
      // Send password reset email
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
        subject: "Your password reset link",
        text:
          "Hello " +
          user.name +
          "!\n" +
          "Please follow the link below to reset your password:\n" +
          "http://localhost:3000/change-password?email=" +
          user.email +
          "&code=" +
          user.verificationCode +
          "\n- Matcha team.  "
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          errors.email = "Email could not be sent. Please try again later.";
          return res.status(400).json(errors);
        }
      });
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/change-password
// @desc    Activate user's account with email code
// @access  Public
router.post("/change-password", (req, res) => {
  // console.log(code);
  const { errors, isValid } = validatePassInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const code = req.body.code;
  const newPassword = req.body.password;

  // find user by email
  db.collection("users")
    .findOne({
      $and: [
        { email: email },
        {
          verificationCode: code
        }
      ]
    })
    .then(user => {
      console.log(user);
      if (user) {
        //change user pass
        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) throw err;
          // user.password = hash;
          db.collection("users")
            .findOneAndUpdate(
              { email: { $eq: email } },
              { $set: { password: hash } }
            )
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      } else {
        errors.password2 = "Something went wrong. Please try again later.";
        return res.status(400).json(errors);
      }
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
      email: req.user.email,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
