const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");

const createLikeNotification = async (postId, sourceUserId, targetUserId) => {
  try {
    const notification = {
      notificationType: "LIKE",
      post: postId,
      targetUser: targetUserId,
      sourceUser: sourceUserId,
    };
    await Notification.create(notification);
    // console.log(Notification);
  } catch (error) {
    console.log(error);
  }
};
const deleteLikeNotification = async (postId, sourceUserId, targetUserId) => {
  try {
    const filter = {
      $and: [
        { notificationType: "LIKE" },
        { post: postId },
        { targetUser: targetUserId },
        { sourceUser: sourceUserId },
      ],
    };
    const result = await Notification.findOneAndRemove(filter);
  } catch (error) {
    console.log(error);
  }
};

router.route("/:postId").get(async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postId }).populate({
      path: "userId",
      select: "fullname username profileUrl",
      model: "User",
    });
    res.json({ success: true, post });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});
router.route("/").post(async (req, res) => {
  try {
    let { fileurl, caption } = req.body;
    const Newpost = new Post({
      userId: req.user.userId,
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
    let { postId } = req.body;
    let postToLike = await Post.findOne({ _id: postId });
    postToLike.likes.push(req.user.userId);
    let likedPost = await postToLike.save();
    likedPost = await likedPost
      .populate({
        path: "userId",
        select: "fullname username",
        model: "User",
      })
      .execPopulate();

    if (postToLike.userId._id != req.user.userId) {
      await createLikeNotification(
        postId,
        req.user.userId,
        postToLike.userId._id
      );
    }
    res.status(201).json({ success: true, likedPost });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

router.route("/unlike").post(async (req, res) => {
  try {
    let { postId } = req.body;
    let postToUnlike = await Post.findOne({ _id: postId });
    postToUnlike.likes.pull(req.user.userId);
    let unLikedPost = await postToUnlike.save();
    unLikedPost = await unLikedPost
      .populate({
        path: "userId",
        select: "fullname username",
        model: "User",
      })
      .execPopulate();
    await deleteLikeNotification(
      postId,
      req.user.userId,
      postToUnlike.userId._id
    );
    res.status(201).json({ success: true, unLikedPost });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

module.exports = router;
