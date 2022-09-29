const passport = require("passport");
const register = require("../model_web/registration");
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

const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();

const AccessToken = require("twilio/lib/jwt/AccessToken");
// const passport-google-oauth20 = require("passport-google-oauth2")

// later on

//  main function
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "546308796336-oa4hj65hm1n2e1orutq07a2jb6ac6h39.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/login/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile.name);
      // const user_ = new register({
      //   fullName: profile.name,
      //   // userName: req.body.username,
      //   email: req.body.email,
      //   phone_no: req.body.phone_no,
      //   password: req.body.password,
      //   conf_password: req.body.conf_password,
      //   gender: req.body.gender,
      // });
      // user_.save()
      return done(null, profile);
    }
  )
);

// function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

// google auth
// middlewares
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

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// routes
router.get("/failed", async (req, res) => {
  res.render("login-landing.ejs", { msg: "Your google login is failed" });
});

router.get("/good", async (req, res) => {
  res.redirect("/user/home-page");
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
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

//  facebook auth

module.exports = router;
