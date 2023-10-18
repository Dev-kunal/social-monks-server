const express = require("express");
const router = express.Router();
const Notification = require("../models/notification.model");

router.route("/").get(async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetUser: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .populate("sourceUser");
    res.status(201).json({ success: true, notifications });
  } catch (error) {
    res.json({ sucess: false, mesg: error.message });
  }
});

module.exports = router;
