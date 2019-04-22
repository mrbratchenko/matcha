const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // generate user token
const keys = require("../../config/keys");
const passport = require("passport"); // verify user's token
var nodemailer = require("nodemailer");
var geoip = require('geoip-lite');

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
              "http://localhost:3000/login?email=" +
              newUser.email +
              "&code=" +
              newUser.verificationCode +
              "\n- Matcha team.  "
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              res.json({
                fail: "Something went wrong :( Please try again"
              });
              return;
            } else if (info.response) {
              console.log("Email sent: " + info.response);
              db.collection("users")
                .insertOne(newUser)
                .then(
                  res.json({
                    success:
                      "Success! Please check your email for account activation link."
                  })
                )
                .catch(err => console.log(err));
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

  const password = req.body.password;
  const notice = {};
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
            username: user.username
          };

          // sign token
          jwt.sign(payload, keys.jwtKey, { expiresIn: 7200 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
          var ip = "178.214.196.34";
          var geo = geoip.lookup(ip);
          db.collection("users")
            .findOneAndUpdate(
              {_id: user._id},
              {$set: {country: geo.country, coordinate: geo.ll, location: geo.city}}
              )
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

  const notice = {};
  // find user by email
  db.collection("users")
    .findOne({
      $and: [{ email: { $eq: email } }, { verificationCode: { $eq: code } }]
    })
    .then(user => {
      if (user && user.isVerified === true) {
        notice.warning = "This account has already been activated.";
        return res.status(200).json(notice);
      } else if (user && user.isVerified === false) {
        console.log(user);
        db.collection("users")
          .findOneAndUpdate({ email: email }, { $set: { isVerified: true } })
          .then(user => console.log(user));
      } else {
        notice.fail = "Something went wrong. Please try again later.";
        return res.status(200).json(notice);
      }
      notice.success = "Your account has been activated.";
      return res.status(200).json(notice);
    })
    .catch(err => res.status(400).json(err));
});

// @route   POST api/users/reset-password
// @desc    Send email to reset user's password
// @access  Public
router.post("/reset-password", (req, res) => {
  console.log(req.body);
  const { errors, isValid } = validateEmailInput(req.body);

  const notice = {};

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
          notice.fail = "Email was not be sent :( Please try again";
          return res.status(200).json(notice);
        } else if (info) {
          notice.success =
            "Success :) Please check your email for a password reset link.";
          return res.status(200).json(notice);
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
  const initCodeCheck = req.body.initCodeCheck;
  console.log(initCodeCheck);

  if (!isValid && !initCodeCheck) {
    return res.status(400).json(errors);
  }

  const notice = {};
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
            .then(user => {
              if (!initCodeCheck) {
                notice.success = "Your password has been changed :)";
                return res.status(200).json(notice);
              } else {
                return res.json({ user });
              }
            })
            .catch(err => res.status(400).json(err));
        });
      } else {
        notice.fail = "Something went wrong:( Please try again";
        return res.status(200).json(notice);
      }
    })
    .catch(err => {
      return res.status(400).json(err);
    });
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

// @route   PPOST api/profile/avatar/:photo_id
// @desc    Set avatar for profile
// @access  Private
router.post(
  "/avatar/:file",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user);
    // Get remove index
    db.collection("users")
      .findOneAndUpdate(
        {
          _id: req.user._id
        },
        { $set: { avatar: req.params.file } },
        { returnOriginal: false }
      )
      .then(profile => {
        res.json(profile.value);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
