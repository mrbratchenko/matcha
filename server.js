const express = require("express");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");
const socketIO = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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
    db.createCollection("users", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "email", "password"],
          additionalProperties: false,
          properties: {
            name: {
              bsonType: "string",
              pattern: "/[a-zA-z]/"
            },
            email: {
              bsonType: "string"
            },
            password: {
              bsonType: "string",
              minLength: 6
            }
          }
        }
      }
    });
    db.createCollection("profiles", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["handle"],
          properties: {
            user_id: {
              bsonType: "object"
            },
            handle: {
              bsonType: "string"
            },
            gender: {
              bsonType: "string"
            },
            sexPreferences: {
              bsonType: "string"
            },
            biography: {
              bsonType: "string"
            },
            interests: {
              bsonType: "array"
            },
            pictures: {
              bsonType: "array",
              maxItems: 4
            }
          }
        }
      }
    });
    db.createCollection("posts", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["text"],
          properties: {
            user_id: {
              bsonType: "object"
            },
            text: {
              bsonType: "string"
            },
            name: {
              bsonType: "string"
            },
            avatar: {
              bsonType: "string"
            },
            likes: {
              bsonType: "object"
            },
            comments: {
              user_id: {
                bsonType: "object"
              },
              bsonType: "object",
              properties: {
                text: {
                  bsonType: "string"
                },
                name: {
                  bsonType: "string"
                },
                avatar: {
                  bsonType: "string"
                },
                date: {
                  bsonType: "date",
                  default: Date.now
                }
              }
            },
            date: {
              bsonType: "date",
              default: Date.now
            }
          }
        }
      }
    });
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

io.on("connection", () => {
  console.log("IO connection");
});

const port = process.env.PORT || 8100;

app.listen(port, () => console.log(`Server running on port ${port}`));
