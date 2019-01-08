const express = require("express");
const router = express.Router();
const passport = require("passport");
const ObjectId = require("mongodb").ObjectID;

// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts works!" }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
  db.collection("posts")
    .find()
    // .sort({ date: true })
    .toArray((err, posts) => {
      if (!posts) {
        res.status(404).json({ nopostfound: "No posts found" });
      }
      res.json(posts);
    });
});

// @route   GET api/post/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ nopostfound: "No post found with this ID" });
  }
  db.collection("posts")
    .findOne({ _id: { $eq: ObjectId(req.params.id) } })
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with this ID" })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      // If any errors send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = {
      _id: new ObjectId(),
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user._id,
      likes: [],
      comments: [],
      date: Date.now()
    };
    // db.collection("posts")
    //   .insertOne(newPost)
    //   .then(post => res.json(post));
    db.collection("posts")
      .insertOne(newPost)
      .then(
        db
          .collection("posts")
          .findOne({ _id: { $eq: ObjectId(newPost._id) } })
          .then(post => res.json(post))
      );
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("profiles")
      .findOne({ user: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("posts")
          .findOne({ _id: { $eq: ObjectId(req.params.id) } })
          .then(post => {
            // Check for post owner
            if (post.user.toString() !== req.user._id.toString()) {
              return res
                .status(401)
                .json({ notauthorized: "User not authorized" });
            }
            // Delete
            db.collection("posts")
              .removeOne({ _id: { $eq: ObjectId(req.params.id) } })
              .then(() => res.json({ success: true }));
          })
          .catch(err =>
            res.status(404).json({ nopostfound: "No post found with this ID" })
          );
      });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("profiles")
      .findOne({ user: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("posts")
          .findOne({ _id: ObjectId(req.params.id) })
          .then(post => {
            // Check to see if user already liked the post
            if (
              post.likes.filter(
                like => like.user.toString() === req.user._id.toString()
              ).length > 0
            ) {
              return res
                .status(400)
                .json({ alreadyliked: "User already liked this post" });
            }

            // Add user id to likes array
            db.collection("posts")
              .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                  $push: {
                    likes: {
                      _id: new ObjectId(),
                      user: ObjectId(req.user._id)
                    }
                  }
                }
              )
              .then(post => res.json(post))
              .catch(err => console.log(err));
          })
          .catch(err => res.status(404).json({ nopostfound: "No post found" }));
      });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Inlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get remove index
    db.collection("profiles")
      .findOne({ user: ObjectId(req.user._id) })
      .then(profile => {
        db.collection("posts")
          .findOne({ _id: ObjectId(req.params.id) })
          .then(post => {
            // Check to see if user already liked the post
            if (
              post.likes.filter(
                like => like.user.toString() === req.user._id.toString()
              ).length === 0
            ) {
              return res
                .status(400)
                .json({ notliked: "You have not liked this post yet" });
            }
            // Get remove index
            db.collection("posts")
              .updateOne(
                { "likes.user": ObjectId(req.user._id) },
                {
                  $pull: {
                    likes: { user: ObjectId(req.user._id) }
                  }
                }
              )
              .then(profile => res.json(profile));
          })
          .catch(err => res.status(404).json({ nopostfound: "No post found" }));
      });
  }
);

// @route   POST api/posts/comment/:id
// @desc    add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.collection("posts")
      .findOne({ _id: ObjectId(req.params.id) })
      .then(post => {
        const newComment = {
          _id: new ObjectId(),
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user._id
        };

        // Add to comment array
        db.collection("posts")
          .findOneAndUpdate({}, { $push: { comments: newComment } })
          .then(post => res.json(post.value));
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    delete comment from post
// @access  Private
router.delete(
  "/comment/:id/:com_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.collection("posts")
      .findOne({ _id: ObjectId(req.params.id) })
      .then(post => {
        // Check to see if the comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.com_id.toString()
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        console.log(req.params.com_id);
        db.collection("posts")
          .findOneAndUpdate(
            { "comments._id": ObjectId(req.params.com_id) },
            {
              $pull: {
                comments: { _id: ObjectId(req.params.com_id) }
              }
            },
            {
              sort: { _id: 1 },
              returnOriginal: false
            }
          )
          .then(profile => res.json(profile.value));
      })
      .catch(err => res.status(404).json({ nopostfound: "No post found" }));
  }
);

module.exports = router;
