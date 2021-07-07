const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const followRouter = require("./routes/follow.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const initializedDBConnection = require("./db/db.connect");
const Following = require("./models/following.model");
const Post = require("./models/post.model");
initializedDBConnection();

app.use("/user", userRouter);
app.use("/posts", postRouter);
app.use("/followunfollow", followRouter);

app.get("/", (req, res) => {
  res.send("Hello Social Media");
});

// app.get("/feed", async (req, res) => {
//   try {
//     let userId = req.headers.userid;
//     // all the users i follow
//     const usersIFollow = await Following.find({ userId }).select("followingId");

//     const ids = usersIFollow.map((user) => user.followingId);
//     // get their latest posts
//     const postOfUsersIFollow = await Post.find({ userId: { $in: ids } }).sort([
//       ["createdAt", -1],
//     ]);

//     res.json({ success: true, postOfUsersIFollow });
//   } catch (error) {
//     res.json({ success: false, mesg: error.message });
//   }
// });

app.listen(7000, () => {
  console.log("Server Started");
});
