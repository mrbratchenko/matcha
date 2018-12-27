const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const keys = require("../config/keys");
const ObjectId = require("mongodb").ObjectID;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.jwtKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (payload, done) => {
      console.log(payload);
      db.collection("users")
        .findOne({ _id: ObjectId(payload.id) })
        .then(user => {
          // check for user
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
