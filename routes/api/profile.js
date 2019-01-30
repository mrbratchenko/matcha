const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;
const multer = require("multer");
const path = require("path");

// Load validation
const validateProfileInput = require("../../validation/profile");

// @route   GET api/profile
// @desc    Get current users profile
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

// @route   GET api/profile/photos
// @desc    Get profile photos
// @access  Private
router.get(
  "/photos",
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
  const errors = {};
  db.collection("users")
    .find({}, { fields: { password: 0, isVerified: 0, verificationCode: 0 } })
    .toArray((err, profiles) => {
      if (profiles.length === 0 || err) {
        errors.profiles = "There are no profiles";
        return res.status(404).json(errors);
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
  // if (!req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
  //   errors.profile = "There is no profile for this user";
  //   return res.status(404).json(errors);
  // }
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
      // return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    // console.log(req.body);
    profileFields.username = req.body.username;
    profileFields.name = req.body.name;
    profileFields.email = req.body.email;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.gender) profileFields.gender = req.body.gender;
    if (req.body.preference) profileFields.preference = req.body.preference;

    if (
      typeof req.body.interests !== "undefined" &&
      req.body.interests.indexOf(",") > -1 &&
      req.body.interests.indexOf("#") > -1
    ) {
      profileFields.interests = req.body.interests.split(",");
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
          console.log(errors);
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
  "/upload",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log("sb2 " + JSON.stringify(req.body));
    const storage = multer.diskStorage({
      destination: "./client/src/user-photos/",
      filename: function(req, file, cb) {
        console.log("sb2 " + JSON.stringify(req.body));
        cb(
          null,
          req.body.user + "_" + Date.now() + path.extname(file.originalname)
        );
      }
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 }
    }).single("myImage");

    upload(req, res, err => {
      if (err) {
        return res.status(400).json(err);
      }

      console.log("Request ---", req.body);
      console.log("Request file ---", req.file); //Here you get file.
      return res.json({ file: `${req.file.path}` });
    });
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

module.exports = router;
