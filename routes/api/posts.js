const express = require("express");
const router = express.Router();

// @route GET api/posts
// @desc Tests post route
// @access Public route
router.get("/", (req, res) => {
  res.json({ msg: "Post Works" });
});

module.exports = router;
