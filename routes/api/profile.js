const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");
// Load User model
const User = require("../../models/User");
// Load profile validation
const validateProfileInput = require("../../validation/profile");
// Load experience validation
const validateExperienceInput = require("../../validation/experience");
// Load education validation
const validateEducationInput = require("../../validation/education");

// @route   GET api/Profile
// @desc    Get current users profile
// @access  Private route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]) // Connected with user id inside profile schema allows to add data from relevant user to the current data
      .then(profile => {
        errors.noprofile = "There is no profile for this user";
        if (!profile) {
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(e => res.status(404).json(e));
  }
);

// @route   POST api/Profile
// @desc    Create or edit user profile
// @access  Private route
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Destructure with validation function
    const { errors, isValid } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social set object
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public route
router.get("/all", (req, res) => {
  errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      errors.noprofile = "There are no profiles";
      if (!profiles) {
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(e => res.status(400).json(e));
});

// @route   GET api/profile/handle/:handle
// @desc    Get the profile by handle
// @access  Public route
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(e => res.status(404).json(e));
});

// @route   GET api/profile/user/:user_id
// @desc    Get the profile by handle
// @access  Public route
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(e => res.status(404).json("There is no such user"));
});

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private route
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Destructure with validation function
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add the experience object to profile array
      profile.experience.unshift(newExp);
      // Save and return the new updated profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST api/profile/education
// @desc    Add education to profila
// @access  Private route
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Destructure with validation function
    const { errors, isValid } = validateEducationInput(req.body);

    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add the experience object to profile array
      profile.education.unshift(newEdu);
      // Save and return the new updated profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private route
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(e => res.status(404).json(e));
    });
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private route
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      // Save updated profile
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(e => res.status(404).json(e));
    });
  }
);

// @route   DELETE api/profile/
// @desc    Delete user and profile
// @access  Private route
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
