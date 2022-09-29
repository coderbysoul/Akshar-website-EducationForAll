const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy
const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const { session } = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const register = require("../model_web/registration");


// main function
passport.use(new FacebookStrategy({
    clientID: "1846210625549182",
    clientSecret: "820cbf48871a3cbed0ea4dfa40869088",
    callbackURL: "http://localhost:3000/login/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // register.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(null, user);
    // });
  }
))

// app.use(session({
//   resave: false,
//   saveUninitialized: true.valueOf,
//   secret : "820cbf48871a3cbed0ea4dfa40869088"
// }))

app.use(passport.initialize())

app.use(passport.session())

passport.serializeUser(function (user,done){
  done(null,user )
})

passport.deserializeUser(function (obj,done){
  done(null,obj)
})

// routes

router.get("/failed-fb", async (req, res) => {
  res.render("login-landing.ejs", { msg: "Your facebook login is failed" });
});

router.get("/good",async (req, res) => {
  res.redirect("/user/home-page");
});

router.get("/facebook", passport.authenticate("facebook", { }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/login/good");
  }
);

router.get("/loggedout", async (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/user/main-page");
});

module.exports = router;
