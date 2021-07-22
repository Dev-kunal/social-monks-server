const Following = require("../../models/following.model");

const followers = async (req, res) => {
  try {
    let { userId } = req.body;
    const filter = {
      $and: [{ followingId: userId }, { followStatus: "following" }],
    };
    const followers = await Following.find(filter)
      .populate({
        path: "userId",
        select: "fullname username profileUrl",
        model: "User",
      })
      .select(["userId"]);

    res.json({ succes: true, followers });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
};

module.exports = followers;
