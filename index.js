const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const initializedDBConnection = require("./db/db.connect");
initializedDBConnection();

app.use("/user", userRouter);
app.use("/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello Social Media");
});

app.listen(7000, () => {
  console.log("Server Started");
});
