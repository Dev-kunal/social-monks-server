const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");

router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.json({ success: true, posts });
  } catch (error) {
    res.json({ success: false, esg: error.message });
  }
});

module.exports = router;
