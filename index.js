const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

const authVerify = require("./middlewares/authverify");

const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const followRouter = require("./routes/follow.route");
const authRouter = require("./routes/auth.route");
const notificationRouter = require("./routes/notifications.route");
const profileRoute = require("./routes/profile.route");

app.use(cors());
app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const initializedDBConnection = require("./db/db.connect");
initializedDBConnection();

app.use("/auth", authRouter);
app.use("/notifications", authVerify, notificationRouter);
app.use("/user", authVerify, userRouter);
app.use("/posts", authVerify, postRouter);
app.use("/followunfollow", authVerify, followRouter);
app.use("/profile", authVerify, profileRoute);

app.get("/", (req, res) => {
  res.send("Hello Social Media");
});

// route 404 do not move
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "route not found on server",
  });
});

app.listen(process.env.PORT || 7000, () => {
  console.log("Server Started");
});
