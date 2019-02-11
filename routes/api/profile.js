const express = require("express");
const router = express.Router();

// @route GET api/Profile
// @desc Tests Profile route
// @access Public route
router.get("/", (req, res) => {
  res.json({ msg: "Profile Works" });
});

module.exports = router;
