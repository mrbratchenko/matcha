const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var nodemailer = require("nodemailer");
const keys = require("../../config/keys");

// Load validation
const validateProfileInput = require("../../validation/profile");

// @route   POST api/profile/like/:id
// @desc    Like profile
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users")
      .findOne({ _id: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("users")
          .findOne({ _id: ObjectId(req.params.id) })
          .then(profile => {
            // Check to see if user already liked the profile
            if (
              profile.likes &&
              profile.likes.filter(
                like => like.user.toString() === req.user._id.toString()
              ).length > 0
            ) {
              return res.status(400).json({
                alreadyliked: "You already liked this profile",
                profileId: req.params.id
              });
            }
            // Add user id to likes array
            db.collection("users")
              .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                  $push: {
                    likes: {
                      _id: new ObjectId(),
                      user: ObjectId(req.user._id),
                      avatar: req.user.avatar,
                      username: req.user.username
                    }
                  },
                  $inc: { fame: 10 }
                }
              )
              .then(profile => res.json(profile));

            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: keys.mailerUser,
                pass: keys.mailerPass
              }
            });
            var mailOptions = {
              from: "Matcha <donotreply@matcha.com>",
              to: profile.email,
              subject: "Your profile has been liked",
              text:
                "Hello " +
                profile.name +
                "!\n" +
                "Your profile has just been liked by " +
                req.user.name +
                "\n- Matcha team.  "
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
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
          })
          .catch(err => console.log(err));
      });
  }
);

// @route   POST api/profiles/unlike/:id
// @desc    Unlike profile
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users")
      .findOne({ _id: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("users")
          .findOne({ _id: ObjectId(req.params.id) })
          .then(profile => {
            // Check to see if user already liked the profile
            if (
              profile.likes &&
              profile.likes.filter(
                like => like.user.toString() === req.user._id.toString()
              ).length === 0
            ) {
              return res.status(400).json({
                notliked: "You have not liked this profile yet",
                profileId: req.params.id
              });
            }
            // Get remove index
            db.collection("users")
              .updateOne(
                { "likes.user": ObjectId(req.user._id) },
                {
                  $pull: {
                    likes: { user: ObjectId(req.user._id) }
                  },
                  $inc: { fame: -10 }
                }
              )
              .then(profile => res.json(profile));
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: keys.mailerUser,
                pass: keys.mailerPass
              }
            });
            var mailOptions = {
              from: "Matcha <donotreply@matcha.com>",
              to: profile.email,
              subject: "Your profile has been unliked",
              text:
                "Hello " +
                profile.name +
                "!\n" +
                "Your profile has just been unliked by " +
                req.user.name +
                "\n- Matcha team.  "
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
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
          })
          .catch(err =>
            res.status(404).json({ noprofilefound: "No profile found" })
          );
      });
  }
);

// @route   GET api/profile
// @desc    Get current user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    db.collection("users")
      .findOne(
        {
          _id: req.user._id
        },
        { fields: { password: 0, isVerified: 0, verificationCode: 0 } }
      )
      .then(profile => {
        if (!profile) {
          errors.profile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => console.log(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const filter = JSON.parse(req.query.filter);
  if (filter && filter.tags && filter.tags.length) {
    for (var i = 0; i < filter.tags.length; i++) {
      filter.tags[i] = "#" + filter.tags[i];
    }
  }
  if (filter && filter.tag !== "") {
    filter.tags.push("#" + filter.tag);
  }
  const errors = {};
  db.collection("users")
    .find(
      {
        location:
          !filter || filter.location === "" ? { $not: /""/ } : filter.location,
        age: {
          $gte: filter && filter.ageFrom ? filter.ageFrom : 18,
          $lte: filter && filter.ageTo ? filter.ageTo : 100
        },
        fame: {
          $gte: filter && filter.fameFrom ? filter.fameFrom : 1,
          $lte: filter && filter.fameTo ? filter.fameTo : 1000000
        },
        interests: {
          $in:
            filter && filter.tags && filter.tags.length
              ? filter.tags
              : [/(.*?)/]
        }
      },
      { fields: { password: 0, isVerified: 0, verificationCode: 0 } }
    )
    .toArray((err, profiles) => {
      if (err || profiles.length) {
        errors.profiles = "There are no profiles";
        return res.json(profiles);
      }
      res.json(profiles);
    });
});

// @route   GET api/profile/username/:username
// @desc    Get profile by username
// @access  Public
router.get("/username/:username", (req, res) => {
  var errors = {};
  db.collection("users")
    .findOne(
      {
        username: req.params.username
      },
      { fields: { password: 0, isVerified: 0, verificationCode: 0 } }
    )
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => console.log(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user_id
// @access  Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  db.collection("users")
    .findOne(
      {
        _id: ObjectId(req.params.user_id)
      },
      { fields: { password: 0, isVerified: 0, verificationCode: 0 } }
    )
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => console.log(err));
});

// @route   POST api/profile
// @desc    Create or Edit current user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.username = req.body.username;
    profileFields.name = req.body.name;
    profileFields.email = req.body.email;
    profileFields.age = req.body.age;
    if (req.body.company) profileFields.company = req.body.company;
    profileFields.location = req.body.location;
    profileFields.age = req.body.age;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.preference) profileFields.preference = req.body.preference;

    if (
      typeof req.body.interests !== "undefined" &&
      req.body.interests.indexOf(",") > -1 &&
      req.body.interests.indexOf("#") > -1
    ) {
      profileFields.interests = req.body.interests.split(",");
      profileFields.interests = profileFields.interests.map(
        Function.prototype.call,
        String.prototype.trim
      );
      profileFields.interests.map(str => {
        if (str.trim().indexOf("#") !== 0)
          errors.interests = "Please use tags with every interest";
      });
    } else if (req.body.interests === "") {
      errors.interests = "Interests field cannot be empty";
    } else {
      errors.interests = "Please use commas and tags";
    }

    // Social
    profileFields.social = {};
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    db.collection("users")
      .findOne({
        $and: [
          { _id: { $ne: req.user._id } },
          {
            $or: [
              { email: { $eq: req.body.email } },
              { username: { $eq: req.body.username } }
            ]
          }
        ]
      })
      .then(profile => {
        if (profile && profile.email === req.body.email) {
          errors.email = "Profile with this email already exists";
        }
        if (profile && profile.username === req.body.username) {
          errors.username = "This username is already taken";
        }

        if (Object.keys(errors).length > 0 || !isValid) {
          return res.status(400).json(errors);
        }

        db.collection("users")
          .findOneAndUpdate(
            { _id: ObjectId(req.user._id) },
            { $set: profileFields },
            { new: true }
          )
          .then(profile => res.json(profile));
      });
  }
);

// @route   POST api/upload
// @desc    Upload photo of profile
// @access  Private
router.post(
  "/photos",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    const errors = {};

    const storage = multer.diskStorage({
      destination: "./client/src/user-photos/",
      filename: function(req, file, callback) {
        // check if extention of file is correct
        if (
          path.extname(file.originalname) !== ".jpeg" &&
          path.extname(file.originalname) !== ".jpg" &&
          path.extname(file.originalname) !== ".png" &&
          path.extname(file.originalname) !== ".bmp"
        ) {
          errors.format = "Please use .jpg, .png or .bmp format";
          return res.status(404).json(errors);
        }

        // check if max-5 photo already uploaded
        db.collection("users")
          .findOne({ _id: ObjectId(req.body.user) })
          .then(profile => {
            if (profile.photos && profile.photos.length > 4) {
              errors.format = "You may upload 5 photos only";
              return res.status(404).json(errors);
            } else {
              const filename =
                req.body.user +
                "_" +
                Date.now() +
                path.extname(file.originalname);
              callback(null, filename);
            }
          });
      }
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 }
    }).single("userPhoto");

    upload(req, res, err => {
      if (err) {
        errors.format = "Something went wrong. Please try again later";
        return res.status(404).json(errors);
      }
      if (!req.file) {
        errors.format = "Please choose a file";
        return res.status(404).json(errors);
      }
      db.collection("users")
        .findOneAndUpdate(
          { _id: ObjectId(req.body.user) },
          { $push: { photos: req.file.filename } },
          { returnOriginal: false }
        )
        .then(profile => {
          res.json(profile.value);
        });
    });
  }
);

// @route   DELETE api/profile/:photo_id
// @desc    Delete a picture from profile
// @access  Private
router.delete(
  "/photos/:file",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users")
      .findOneAndUpdate(
        { photos: req.params.file },
        { $pull: { photos: req.params.file } },
        {
          sort: { _id: 1 },
          returnOriginal: false
        }
      )
      .then(profile => {
        db.collection("users").findOneAndUpdate(
          { avatar: req.params.file },
          { $set: { avatar: "" } }
        );
        const filePath = `./client/src/user-photos/${req.params.file}`;
        fs.unlinkSync(filePath);
        res.json(profile.value);
      })
      .catch(err => res.status(404).json({ nophotofound: "No photo found" }));
  }
);

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users").removeOne({ _id: ObjectId(req.user._id) });
  }
);

// @route   DELETE api/profile/
// @desc    Delete user profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users").removeOne({ _id: ObjectId(req.user._id) });
  }
);

router.post(
  "/fake",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.collection("users")
      .findOne({ _id: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("users")
          .findOne({ _id: ObjectId(req.body.name) })
          .then(profile => {
            // Check to see if user already liked the profile
            if (
              profile.fake &&
              profile.fake.filter(
                fake => fake.user.toString() === req.user._id.toString()
              ).length > 0
            ) {
              return res.status(400).json({
                alreadyfaked: "You already reported this profile",
                profileId: req.body.name
              });
            }
            // Add user id to likes array
            db.collection("users")
              .updateOne(
                { _id: ObjectId(req.body.name) },
                {
                  $push: {
                    fake: {
                      _id: new ObjectId(),
                      user: ObjectId(req.user._id)
                    }
                  }
                }
              )
              .then(profile =>
                res.status(400).json({
                  faked: "Thank you for reporting!",
                  profileId: req.body.name
                })
              );
          })
          .catch(err => console.log(err));
      });
  }
);

module.exports = router;
