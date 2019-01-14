const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;

// Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// @route   GET api/profile
// @desc    Test current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user._id);
    const errors = {};
    // if (!req.user_id.match(/^[0-9a-fA-F]{24}$/)) {
    //   errors.profile = "There is no profile for this user";
    //   return res.status(404).json(errors);
    // }
    db.collection("profiles")
      .aggregate([
        {
          $match: { user: ObjectId(req.user._id) }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },

        {
          $project: {
            "user._id": 0,
            "user.ifVerified": 0,
            "user.password": 0,
            "user.verificationCode": 0
          }
        },
        {
          $unwind: "$user"
        }
      ])
      .toArray((err, profile) => {
        if (profile.length === 0 || err) {
          errors.profile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
        console.log(profile);
      });
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  db.collection("profiles")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "user.email": 0,
          "user.password": 0
        }
      }
    ])
    .toArray((err, profiles) => {
      if (profiles.length === 0 || err) {
        errors.profile = "There are no profiles";
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
  db.collection("profiles")
    .aggregate([
      {
        $match: { username: req.params.username }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "user.email": 0,
          "user.password": 0
        }
      }
    ])
    .toArray((err, profile) => {
      if (profile.length === 0 || err) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    });
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
  db.collection("profiles")
    .aggregate([
      {
        $match: { user: ObjectId(req.params.user_id) }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "user.email": 0,
          "user.password": 0
        }
      }
    ])
    .toArray((err, profile) => {
      if (profile.length === 0 || err) {
        errors.profile = "There is no profile for this user";
        return res.status(404).json(errors);
      }
      res.json(profile);
    });
});

// @route   POST api/profile
// @desc    Create or Edit current user profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

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
    if (req.body.status) profileFields.status = req.body.status;
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

    db.collection("profiles")
      .findOne({
        $and: [
          { user: { $ne: req.user._id } },
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

        db.collection("profiles")
          .findOne({ user: ObjectId(req.user._id) })
          .then(profile => {
            if (profile) {
              // Update
              db.collection("profiles")
                .findOneAndUpdate(
                  { user: ObjectId(req.user._id) },
                  { $set: profileFields },
                  { new: true }
                )
                .then(profile => res.json(profile));
            } else {
              // Create
              // Check if username exists
              db.collection("profiles")
                .findOne({ username: profileFields.username })
                .then(profile => {
                  if (profile) {
                    errors.username = "That username already exists";
                    return res.status(400).json(errors);
                  }
                  //   Save profile
                  db.collection("profiles")
                    .insertOne(profileFields)
                    .then(profile => res.json(profile));
                });
            }
          });
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
    db.collection("profiles")
      .updateOne(
        { user: ObjectId(req.user._id) },
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
    db.collection("profiles")
      .updateOne(
        { user: ObjectId(req.user._id) },
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
    db.collection("profiles")
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
    db.collection("profiles")
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
    db.collection("profiles")
      .removeOne({ user: ObjectId(req.user._id) })
      .then(() => {
        db.collection("users")
          .removeOne({ _id: ObjectId(req.user._id) })
          .then(() => res.json({ sucess: true }));
      });
  }
);

module.exports = router;
