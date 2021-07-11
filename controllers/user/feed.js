const Post = require("../../models/post.model");
const Following = require("../../models/following.model");

const feed = async (req, res) => {
  try {
    let userId = req.user.userId;
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
};

module.exports = feed;
