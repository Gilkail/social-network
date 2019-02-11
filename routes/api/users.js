const express = require("express");
const router = express.Router();

// @route GET api/users
// @desc Tests users route
// @access Public route
router.get("/", (req, res) => {
  res.json({ msg: "User Works" });
});

module.exports = router;
