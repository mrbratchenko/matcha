const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;

// Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

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
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.gender) profileFields.gender = req.body.gender;
    // Skills - split into an array
    console.log(req.body.skills.indexOf(","));

    if (
      typeof req.body.skills !== "undefined" &&
      req.body.skills.indexOf(",") > -1
    ) {
      profileFields.skills = req.body.skills.split(",");
    } else {
      errors.skills = "Please use coma separated values";
    }
    // Social
    profileFields.social = {};
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    profileFields.experience = [];
    profileFields.education = [];

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

// @route   POST api/profile/experience
// @desc    Add exp to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    // Check validation
    if (!isValid) {
      // Return errors with 400 status
      return res.status(400).json(errors);
    }
    const newExp = {
      _id: new ObjectId(),
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    db.collection("users")
      .updateOne(
        { _id: ObjectId(req.user._id) },
        { $push: { experience: newExp } }
      )
      .then(profile => res.json(profile));
  }
);

// @route   POST api/profile/education
// @desc    Add edu to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    // Check validation
    if (!isValid) {
      // Return errors with 400 status
      return res.status(400).json(errors);
    }
    const newEdu = {
      _id: new ObjectId(),
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    };
    db.collection("users")
      .updateOne(
        { _id: ObjectId(req.user._id) },
        { $push: { education: newEdu } }
      )
      .then(profile => res.json(profile));
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete exp from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users")
      .findOneAndUpdate(
        { "experience._id": ObjectId(req.params.exp_id) },
        { $pull: { experience: { _id: ObjectId(req.params.exp_id) } } },
        {
          sort: { _id: 1 },
          returnOriginal: false
        }
      )
      .then(profile => res.json(profile));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete edu from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("users")
      .findOneAndUpdate(
        { "education._id": ObjectId(req.params.edu_id) },
        { $pull: { education: { _id: ObjectId(req.params.edu_id) } } },
        {
          sort: { _id: 1 },
          returnOriginal: false
        }
      )
      .then(profile => res.json(profile.value));
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

module.exports = router;
