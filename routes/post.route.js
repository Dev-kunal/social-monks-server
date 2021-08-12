const express = require("express");
const router = express.Router();
const {
  getPost,
  createPost,
  likePost,
  unlikePost,
} = require("../controllers/post.controller");

router.get("/:postId", getPost);
router.post("/", createPost);
router.post("/like", likePost);
router.post("/unlike", unlikePost);

module.exports = router;
