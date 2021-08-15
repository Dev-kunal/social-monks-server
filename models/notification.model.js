const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      enum: ["NEWFOLLOWER", "LIKE"],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "fullname username profileUrl" },
    },
    sourceUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      populate: { select: "fullnae username profileUrl" },
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
