const express = require("express");
const session = require('express-session');
const passport = require("passport");
const router = express.Router();
const cookieSession = require("cookie-session");
const TwitterStrategy = require("passport-twitter").Strategy;
const app = express();

const AccessToken = require("twilio/lib/jwt/AccessToken");
// const passport-google-oauth20 = require("passport-google-oauth2")

// later on


// function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));
passport.use(
  new TwitterStrategy(
    {
      consumerKey:"w3mZF04OFJ91BtBlewnydCncn",
      consumerSecret:"f1DpeG7CVVkZqjgXV2IwvZatQ269cOgr1IUEwYL23Ns1m6LA0N",
      callbackURL: "http://localhost:3000/login/twitter/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile.name["givenName"], "iuhgiuhiu");
      return done(null, profile);
    }
  )
);

// google auth
// middlewares
// After you declare "app"
passport.serializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, {
      // id: user.id,
      // username: user.username,
      // picture: user.picture
    });
  });
});

passport.deserializeUser(function (user, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const isLoggedIn = (req, res, next) => {
  console.log(req.user, "gsdgsdg");
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};


app.use(session({
    secret: "strategyOptions.session.secret",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


//  main function


// routes
router.get("/failed", async (req, res) => {
  res.render("login-landing.ejs", { msg: "Your google login is failed" });
});

router.get("/good", async (req, res) => {
  res.redirect("/user/home-page");
});

router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["profile"] })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/failed" }),
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

//  twitter auth

module.exports = router;
