const Following = require("../../models/following.model");
const mongoose = require("mongoose");

const following = async (req, res) => {
  try {
    let { userId } = req.body;
    const filter = {
      $and: [
        { userId: mongoose.Types.ObjectId(userId) },
        { followStatus: "following" },
      ],
    };
    const following = await Following.find(filter)
      .populate({
        path: "followingId",
        select: "fullname username profileUrl",
        model: "User",
      })
      .select(["userId"]);
    res.json({ succes: true, following });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
};

module.exports = following;
