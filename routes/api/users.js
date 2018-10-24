const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load iput Validation
const validateRegisterInput = require("../../validation/register");

//Load user Model
const User = require("../../models/User");

//@route  GET api/users/test
//@desc   Tests user route
//@access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Users" });
});

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid, name, email, password } = validateRegisterInput(
    req.body
  );

  // Check Validation
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(email, {
          s: 200, //Size
          r: "pg", //Rating
          d: "mm" //Default
        });
        const newUser = new User({
          name: name,
          email: email,
          avatar,
          password: password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

// @route  GET api/users/login
// @desc   Login User / Reurning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      //Check for user
      if (!user) {
        return res.status(404).json({ email: "User not found" });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // res.json({ msg: 'Success' });
          // user Matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

          // Sign WebToken
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({ success: true, token: "Bearer " + token });
            }
          );
        } else {
          return res.status(400).json({ password: "Password is incorrect" });
        }
      });
    })
    .catch(err => console.log(err));
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id: id,
      name: name,
      email: email
    });
  }
);

module.exports = router;
