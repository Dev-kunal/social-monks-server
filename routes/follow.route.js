const express = require("express");
const router = express.Router();
const Following = require("../models/following.model");
const mongoose = require("mongoose");
const Notification = require("../models/notification.model");

const createFollowedNotification = async (followingId, userId) => {
  try {
    const notification = {
      notificationType: "NEWFOLLOWER",
      targetUser: followingId,
      sourceUser: userId,
    };
    const savedNotification = await Notification.create(notification);
    // console.log(savedNotification);
  } catch (error) {
    console.log(error);
  }
};
const deleteFollowedNotification = async (followingId, userId) => {
  try {
    const filter = {
      $and: [
        { notificationType: "NEWFOLLOWER" },
        { targetUser: followingId },
        { sourceUser: userId },
      ],
    };
    const result = await Notification.findOneAndRemove(filter);
  } catch (error) {
    console.log(error);
  }
};

router
  .route("/")
  .get(async (req, res) => {
    res.json({ mesg: "On Follwing route" });
  })
  // to follow unfollow
  .post(async (req, res) => {
    try {
      let { followingId } = req.body;
      let userId = req.user.userId;
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
          await deleteFollowedNotification(followingId, userId);
          res.json({ sucess: true, unfollowed: true });
        } else {
          followRecord.followStatus = "following";
          await followRecord.save();
          // create notification
          createFollowedNotification(followingId, userId);
          res.json({ sucess: true, followed: true });
        }
      } else {
        const NewFollowing = new Following({ userId, followingId });
        const followResult = await NewFollowing.save();
        createFollowedNotification(followingId, userId);
        res.json({ success: true, followResult });
      }
    } catch (error) {
      console.log(error);
      res.json({ success: false, mesg: error.message });
    }
  });
module.exports = router;
