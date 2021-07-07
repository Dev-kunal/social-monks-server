const mongoose = require("mongoose");

const FollowinSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  followingId: { type: mongoose.Types.ObjectId, ref: "User" },
  followStatus: {
    type: String,
    default: "following",
    enum: ["following", "notfollowing"],
  },
});

const Following = mongoose.model("Following", FollowinSchema);

module.exports = Following;
