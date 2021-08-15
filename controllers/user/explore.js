const Post = require("../../models/post.model");

const explore = async (req, res) => {
  try {
    let userId = req.user.userId;
    const allPosts = await Post.find({ userId: { $nin: [userId] } }).sort([
      ["createdAt", -1],
    ]);
    res.json({ success: true, allPosts });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
};
module.exports = explore;
