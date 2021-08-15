const Post = require("../models/post.model");
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

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findOne({ _id: postId }).populate({
      path: "userId",
      select: "fullname username profileUrl",
      model: "User",
    });
    res.status(200).json({ success: true, post });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, mesg: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    let { fileurl, caption } = req.body;
    const { userId } = req.user;
    const Newpost = new Post({
      userId,
      fileurl,
      caption,
    });
    const savedPost = await Newpost.save();
    res.status(201).json({ success: true, savedPost });
  } catch (error) {
    res.status(500).json({ success: false, mesg: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const { userId } = req.user;
    const postToLike = await Post.findOne({ _id: postId });
    postToLike.likes.push(userId);
    let likedPost = await postToLike.save();
    likedPost = await likedPost
      .populate({
        path: "userId",
        select: "fullname username",
        model: "User",
      })
      .execPopulate();

    if (postToLike.userId._id != userId) {
      await createLikeNotification(postId, userId, postToLike.userId._id);
    }
    res.status(201).json({ success: true, likedPost });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, mesg: error.message });
  }
};

const unlikePost = async (req, res) => {
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
    res.status(500).json({ success: false, mesg: error.message });
  }
};

module.exports = {
  getPost,
  createPost,
  likePost,
  unlikePost,
};
