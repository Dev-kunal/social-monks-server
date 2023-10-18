const express = require("express");
const cors = require("cors");
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
app.use(express.json());

const initializedDBConnection = require("./db/db.connect");
const routeHandler = require("./middlewares/routeHandler");
initializedDBConnection();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/auth", authRouter);
app.use("/notifications", authVerify, notificationRouter);
app.use("/user", authVerify, userRouter);
app.use("/posts", authVerify, postRouter);
app.use("/followunfollow", authVerify, followRouter);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Hello Social Media" });
});

app.use(routeHandler);

app.listen(process.env.PORT || 7000, () => {
  console.log("Server Started");
});
