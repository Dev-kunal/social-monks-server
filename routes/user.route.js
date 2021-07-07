const express = require("express");
const router = express.Router();
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Following = require("../models/following.model");
const mongoose = require("mongoose");

router
  .route("/")
  .get(async (req, res) => {
    try {
      let userId = req.headers.userid;
      const userInfo = await User.aggregate([
        {
          // finds record for the userId
          $match: { _id: mongoose.Types.ObjectId(userId) },
        },
        // finds all post matching with userId
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "userId",
            as: "posts",
          },
        },
        // finds all users to whom i follow
        {
          $lookup: {
            from: "followings",
            localField: "_id",
            foreignField: "userId",
            as: "following",
          },
        },
        // finds all my followers
        {
          $lookup: {
            from: "followings",
            localField: "_id",
            foreignField: "followingId",
            as: "followers",
          },
        },
        // combine all the above results together
        {
          $project: {
            _id: "$_id",
              fullname: "$fullname",
              profileUrl: "$profileUrl",
              username: "$username",
            bio: "$bio",
            posts: "$posts",
            following: { $size: "$following" },
            followers: "$followers" 
          },
        },
      ]);
      res.json({ success: true, userInfo });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        res.json({ success: false, mesg: "Username already Exist" });
      }
      res.json({ success: false, mesg: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const user = req.body.user;
      const Newuser = new User(user);
      const savedUser = await Newuser.save();
      res.json({ success: true, savedUser });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        res.json({ success: false, mesg: "Username already Exist" });
      }
      res.json({ success: false, mesg: error.message });
    }
  });

router.route("/update").post(async (req, res) => {
  try {
    let { username, bio, profileUrl, fullname } = req.body;
    username == ""? delete username: username;
    bio == "" ? delete bio : bio;
    profileUrl == ""? delete profileUrl: profileUrl;
    fullname == ""? delete fullname: fullname;
    const updatedUser = await User.findByIdAndUpdate(
      req.headers.userid,
      { username, bio, profileUrl, fullname },
      { new: true }
    );
    res.json({ success: true, updatedUser });
  } catch (error) {
    if (error.name === "MongoError" && error.code === 11000) {
      res.json({ success: false, mesg: "Username already Exist" });
    }
    res.json({ success: false, mesg: error.message });
  }
});
router.route("/feed").get(async (req, res) => {
  try {
    let userId = req.headers.userid;
    const usersIFollow = await Following.find({ userId }).select("followingId");

    const ids = usersIFollow.map((user) => user.followingId);
    const postOfUsersIFollow = await Post.find({ userId: { $in: ids } })
      .sort([["createdAt", -1]])
      .populate({
        path: "userId",
        select: "fullname username profileUrl",
        model: "User",
      });
    res.json({ success: true, postOfUsersIFollow });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

router.route("/explore").get(async (req, res) => {
  try {
    let userId = req.headers.userid;
    const posts = await Post.find({ userId: { $nin: [userId] } }).sort([
      ["createdAt", -1],
    ]);
    res.json({ success: true, posts });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

router.route("/followers").post(async (req, res) => {
  try {
    let {userId} = req.body;
    const followers = await Following.find({ followingId: userId }).populate(
      {
        path: "userId",
        select: "fullname username",
        model: "User",
      }
    ).select(["userId"])

    res.json({ succes: true, followers });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

router.route("/following").post(async (req, res) => {
  try {
    let {userId} = req.body;
    const filter = {
      $and: [
        { userId: mongoose.Types.ObjectId(userId) },
        { followStatus: "following" },
      ],
    };
    const following = await Following.find(filter)
      .populate(
      {
        path: "followingId",
        select: "fullname username",
        model: "User",
      }).select(["userId"])
    res.json({ succes: true, following });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});

router.route("/search").get(async (req, res) => {
  try {
    let searchTerm = req.headers.searchterm;
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
    });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
});
module.exports = router;
