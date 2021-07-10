const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const login = async (req, res) => {
  try {
    let { username, password } = req.body;
    let user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "User does not exist" });
    }
    const match = await bcrypt.compareSync(password, user.password);
    if (!match) {
      res.status(401).json({ message: "incorrect password" });
    }
    user = await user.save();
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
    user.password = undefined;
    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false });
  }
};

module.exports = login;
