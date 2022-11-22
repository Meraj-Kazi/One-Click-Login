require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models/user-model");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      // return done(null, profile);

      // check if user already exists in our own db
      User.findOne({ platformId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser);
          return done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            platformId: profile.id,
            username: profile.displayName,
            // thumbnail: profile._json.image.url,
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              return done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:5000/auth/facebook/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      // return done(null, profile);

      // check if user already exists in our own db
      User.findOne({ platformId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser);
          return done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            platformId: profile.id,
            username: profile.displayName,
            // thumbnail: profile._json.image.url,
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              return done(null, newUser);
            });
        }
      });
    }
  )
);

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
