const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const passport = require("passport");
const socketIO = require("socket.io");
const http = require("http").Server(app);
const io = socketIO(http);

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
// const proxy = require("http-proxy-middleware");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/', proxy({ target: 'http://127.0.0.1:3000', changeOrigin: true }))
// module.exports = function(app) {
//   app.use(proxy("/**", { // https://github.com/chimurai/http-proxy-middleware
//     target: "http://localhost:3000",
//     secure: false
//   }));
// };

// listening socket connection
// io.on('connection', function(socket){
//   console.log('a user connected');
//   // socket.on('disconnect', function(){
//   //   console.log('user disconnected');
//   // });
// });

// DB config
const url = require("./config/keys").mongoURI;
const MongoClient = require("mongodb").MongoClient;

// DB connect
MongoClient.connect(url, { useNewUrlParser: true })
  .then(client => {
    console.log("DB connected");
    db = client.db("matcha");
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

http.listen(port, () => console.log(`Server running on port ${port}`));
