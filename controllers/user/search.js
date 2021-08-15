const User = require("../../models/user.model");

const search = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const users = await User.find({
      username: { $regex: searchTerm, $options: "i" },
    });
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, mesg: error.message });
  }
};

module.exports = search;
