const express = require("express");
const router = express.Router();

const following = require("../controllers/user/following");
const followers = require("../controllers/user/followers");
const update = require("../controllers/user/update");
const feed = require("../controllers/user/feed");
const explore = require("../controllers/user/explore");
const search = require("../controllers/user/search");

router.get("/explore", explore);
router.get("/feed", feed);
router.post("/update", update);
router.post("/following", following);
router.post("/followers", followers);
router.post("/search", search);

module.exports = router;
