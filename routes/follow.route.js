const express = require("express");
const router = express.Router();
const Following = require("../models/following.model");
const mongoose = require("mongoose");

router
  .route("/")
  .get(async (req, res) => {
    res.json({ mesg: "On Follwing route" });
  })
  // to follow unfollow
  .post(async (req, res) => {
    try {
      let { userId, followingId } = req.body;
      const filter = {
        $and: [
          { userId: mongoose.Types.ObjectId(userId) },
          { followingId: mongoose.Types.ObjectId(followingId) },
        ],
      };
      const followRecord = await Following.findOne(filter);
      if (followRecord) {
        if (followRecord.followStatus === "following") {
          followRecord.followStatus = "notfollowing";
          await followRecord.save();
          res.json({ sucess: true, unfollowed: true });
        } else {
          followRecord.followStatus = "following";
          await followRecord.save();
          res.json({ sucess: true, followed: true });
        }
      } else {
        const NewFollowing = new Following({ userId, followingId });
        const followResult = await NewFollowing.save();
        res.json({ success: true, followResult });
      }
    } catch (error) {
      res.json({ success: false, mesg: error.message });
    }
  });
module.exports = router;
