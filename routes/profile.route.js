const express = require("express");
const router = express.Router();
const getUserProfile = require("../controllers/profile.controller");

router.get("/:userId", getUserProfile);

module.exports = router;
