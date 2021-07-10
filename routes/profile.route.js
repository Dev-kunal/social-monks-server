const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const mongoose = require("mongoose");

router.route("/:userId").get(async (req, res) => {
  try {
    let { userId } = req.params;
    const userData = await User.aggregate([
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
          // need to add status here
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
          followers: "$followers",
        },
      },
    ]);
    res.json({ success: true, userData });
  } catch (error) {
    res.status(404).json({
      success: false,
      mesg: error.message,
    });
  }
});

module.exports = router;
