const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const passport = require("passport");
const socketIO = require("socket.io");
const http = require("http");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const url = require("./config/keys").mongoURI;
const MongoClient = require("mongodb").MongoClient;

// DB connect
MongoClient.connect(url, { useNewUrlParser: true })
  .then(client => {
    console.log("DB connected");
    db = client.db("matcha");
  })
  .then(() => {
    require("./mongoSchemas/User");
    require("./mongoSchemas/Profile");
    require("./mongoSchemas/Post");
  })
  .catch(err => console.log(err));

// Passport
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 8100;

app.listen(port, () => console.log(`Server running on port ${port}`));
