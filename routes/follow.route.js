const express = require("express");
const router = express.Router();
const followUnfollow = require("../controllers/follow.controller");

router.post("/", followUnfollow);

module.exports = router;
