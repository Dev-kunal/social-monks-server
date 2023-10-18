const User = require("../../models/user.model");

const update = async (req, res) => {
  try {
    let { username, bio, profileUrl, fullname } = req.body;
    const condition = {
      username,
      profileUrl,
      bio,
      fullname,
    };
    condition.username == "" ? delete condition.username : condition.username;
    condition.bio == "" ? delete condition.bio : condition.bio;
    condition.profileUrl == ""
      ? delete condition.profileUrl
      : condition.profileUrl;
    condition.fullname == "" ? delete condition.fullname : condition.fullname;
    let userId = req.user.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, condition, {
      new: true,
    });
    res.json({ success: true, updatedUser });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
};

module.exports = update;
