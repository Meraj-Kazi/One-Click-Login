const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require('mongoose');
require("dotenv").config();
require("./auth");

const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(process.env.MONGO_URL, () => {
  console.log('connected to mongodb');
});

app.get("/", (req, res) => {
  res.send(
    '<a href="/auth/google">Authenticate with Google</a> <br> <a href="/auth/facebook">Authenticate with Facebook</a>'
  );
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.username}`);
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/facebook/protected",
    failureRedirect: "/auth/facebook/failure",
  })
);

app.get("/facebook/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.username}`);
});

app.get("/auth/facebook/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("Goodbye!");
});

app.listen(5000, () => console.log("listening on port: 5000"));
