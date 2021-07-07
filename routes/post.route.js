const express = require("express");
const Liked = require("../models/liked.model");
const router = express.Router();
const Post = require("../models/post.model");
const mongoose = require("mongoose");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allPosts = await Post.find({});
      res.json({ success: true, allPosts });
    } catch (error) {
      res.json({ success: false, mesg: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      let { fileurl, caption } = req.body;
      const Newpost = new Post({
        // ajjus id
        userId: "60db08481fa2cb0793c5f465",
        fileurl,
        caption,
      });
      const savedPost = await Newpost.save();
      res.json({ success: true, savedPost });
    } catch (error) {
      res.json({ success: false, mesg: error.message });
    }
  });

router.route("/like").post(async (req, res) => {
  try {
    let { postId, userId } = req.body;
    let postToLike = await Post.findOne({ _id: postId });
    postToLike.likes.push(userId);
    let likedPost = await postToLike.save();
    likedPost = await likedPost
      .populate({
        path: "userId",
        select: "fullname username",
        model: "User",
      })
      .execPopulate();
    // console.log("inside like ", likedPost);
    res.status(201).json({ success: true, likedPost });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});
router.route("/unlike").post(async (req, res) => {
  try {
    let { postId, userId } = req.body;
    let postToUnlike = await Post.findOne({ _id: postId });
    postToUnlike.likes.pull(userId);
    let unLikedPost = await postToUnlike.save();
    unLikedPost = await unLikedPost
      .populate({
        path: "userId",
        select: "fullname username",
        model: "User",
      })
      .execPopulate();
    // console.log("inside unlike ", unLikedPost);
    res.status(201).json({ success: true, unLikedPost });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

module.exports = router;
