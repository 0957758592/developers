const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Post Model
const Post = require("../../models/Post");
//Profile Model
const Profile = require("../../models/Profile");

//Validation
const validatePostInput = require("../../validation/post");

//@route  GET api/posts/test
//@desc   Tests post route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts" });
});

//@route    GET api/posts
//@desc     Get all posts
//@access   Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No any posts found" }));
});

//@route    GET api/posts/:id
//@desc     Get post by ID
//@access   Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

//@route    DELETE api/posts/:id
//@desc     Delete post by ID
//@access   Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            //Check for post owner
            if (post.user.toString() !== req.user.id) {
              return res
                .status(401)
                .json({ notauthorized: "User not authorized" });
            }
            // Delete
            post.remove().then(() => res.json({ success: true }));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      })
      .catch(err =>
        res
          .status(404)
          .json({ noaccess: "You have no access to delete this post" })
      );
  }
);

//@route    POST api/posts/like/:id
//@desc     Like post
//@access   Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(404)
              .json({ alreadyliked: "User already liked this post" });
          }

          //Add user id likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

//@route    POST api/posts/unlike/:id
//@desc     Unlike post
//@access   Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this post" });
        }
        //Get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        //Splice out of array
        post.likes.splice(removeIndex, 1);

        //Save
        post.save().then(post => res.json(post));
      });
    });
  }
);

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      //if any errors, send 400 status with errors object
      return res.status(400).json(errors);
    }

    const { text, name, avatar } = req.body;
    const newPost = new Post({
      text: text,
      name: name,
      avatar: avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

//@route    POST api/posts/comment/:id
//@desc     Add comment
//@access   Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
      //If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const { text, name, avatar } = req.body;
        const newComment = {
          text: text,
          name: name,
          avatar: avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Remove comment from post
//@access   Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            //Check to see if the comment exist
            if (
              post.comments.filter(
                comment => comment._id.toString() === req.params.comment_id
              ).length === 0
            ) {
              return res
                .status(404)
                .json({ commentnotexist: "Comment does not exist" });
            }

            //Get remove index
            const removeIndex = post.comments
              .map(item => item._id.toString())
              .indexOf(req.params.comment_id);

            // //Get own post index
            // const indexUserId = post.comments
            //   .map(comment => comment.user.toString())
            //   .findIndex((user, index) => {
            //     if (
            //       (user === req.user.id && index === removeIndex) ||
            //       (post.user.toString() === req.user.id &&
            //         index === removeIndex)
            //     ) {
            //       console.log("user: => ", user);
            //       return index;
            //     }
            //   });

            // if (indexUserId !== removeIndex) {
            //   return res
            //     .status(401)
            //     .json({ notowncommets: "It's not your own comments" });
            // }

            // Splice comment from array
            post.comments.splice(removeIndex, 1);
            post.save().then(post => res.json(post));
          })
          .catch(err =>
            res.status(404).json({ postnotfound: "No post found" })
          );
      })
      .catch(err =>
        res
          .status(400)
          .json({ noaccess: "You have no permission to delete this comment" })
      );
  }
);

module.exports = router;
