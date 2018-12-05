const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
const url = require("./config/keys").mongoURI;
const MongoClient = require("mongodb").MongoClient;

// DB connect
MongoClient.connect(
  url,
  { useNewUrlParser: true }
)
  .then(client => {
    console.log("DB connected");
    db = client.db("matcha");
    // db.createCollection("users", {
    //   validator: {
    //     $and: [
    //       { name: { $type: "string" } },
    //       { email: { $type: "string" } },
    //       { password: { $type: "string" } }
    //     ]
    //   }
    // });
    // db.createCollection("profiles", {
    //   validator: {
    //     $and: [
    //       { handle: { $type: "string" } },
    //       { company: { $type: "string" } },
    //       { website: { $type: "string" } },
    //       { location: { $type: "string" } },
    //       { status: { $type: "string" } },
    //       { skills: { $type: "string" } },
    //       { password: { $type: "string" } }
    //     ]
    //   }
    // });
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
