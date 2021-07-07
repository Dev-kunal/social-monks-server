const mongoose = require("mongoose");

const LikedSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Types.ObjectId, ref: "Post" },
    likeStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Liked = mongoose.model("Liked", LikedSchema);

module.exports = Liked;
