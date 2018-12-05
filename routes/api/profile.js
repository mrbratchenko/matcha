const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;

// Load validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile works!" }));

// @route   GET api/profile
// @desc    Test current users profile
// @access  Private

// router.get(
//   "/",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     const errors = {};
//     db.collection("profiles")
//       .findOne({ user: ObjectId(req.user._id) })
//       .then(profile => {
//         if (!profile) {
//           errors.profile = "There is no profile for this user";
//           return res.status(404).json(errors);
//         }
//         profile.user._id = "dslkflsd";
//         res.json(profile);
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    if (!req.user_id.match(/^[0-9a-fA-F]{24}$/)) {
      errors.profile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
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

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
  var errors = {};
  db.collection("profiles")
    .aggregate([
      {
        $match: { handle: req.params.handle }
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
  if (!req.params.user_id.match(/^[0-9a-fA-F]{24}$/)) {
    errors.profile = "There is no profile for this user";
    return res.status(404).json(errors);
  }
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

    // Check validation
    if (!isValid) {
      // Return errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // console.log(req.user._id);
    db.collection("profiles")
      .findOne({ user: ObjectId(req.user._id) })
      .then(profile => {
        if (profile) {
          // Update
          //   console.log("here");
          db.collection("profiles")
            .findOneAndUpdate(
              { user: ObjectId(req.user._id) },
              { $set: profileFields },
              { new: true }
            )
            .then(profile => res.json(profile));
        } else {
          // Create
          // Check if handle exists
          db.collection("profiles")
            .findOne({ handle: profileFields.handle })
            .then(profile => {
              if (profile) {
                errors.handle = "That handle already exists";
                res.status(400).json(errors);
              }
              //   Save profile
              db.collection("profiles")
                .insertOne(profileFields)
                .then(profile => res.json(profile));
            });
        }
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
    db.collection("profiles")
      .findOne({ user: ObjectId(req.user._id) })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.location,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.desctription
        };
        console.log(profile);
        // console.log(newExp);
        // Add to exp array
        db.collection("profiles").update({
          $push: { experience: newExp }
        });
      });
  }
);

module.exports = router;
