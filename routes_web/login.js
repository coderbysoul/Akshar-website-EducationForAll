const { render } = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();
const path = require("path");

const register = require("../model_web/registration");
const app = express();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());            
// database connection
const uri ="mongodb+srv://raj4321:YIfQx247fYNf0YW0@braincellsdb.ajb1asy.mongodb.net/?retryWrites=true&w=majority";
// const uri_2 ="mongodb://raj4321:YIfQx247fYNf0YW0@ac-lvdgsyz-shard-00-00.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-01.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-02.ajb1asy.mongodb.net:27017/?ssl=true&replicaSet=atlas-n2mj96-shard-0&authSource=admin&retryWrites=true&w=majority";
const db = mongoose.connect(uri);
const con = mongoose.connection;

// static files
router.use(
  "/css_web",
  express.static(path.join(__dirname, "../public/css_web"))
);
router.use(
  "/js_web",
  express.static(path.join(__dirname, "../public/js_web"))
);
router.use(
  "/img_web",
  express.static(path.join(__dirname, "../public/img_web"))
);

// Set views for website

app.set("views", path.join(__dirname, "../views_web"));
app.set("view engine", "ejs");




// login
router.get("/login", async (req, res) => {
  res.render("login-landing.ejs",{msg:""});
});

router.post("/login", async (req, res) => {

  //   checking input data
  const emailcheck = await register.find({ email: req.body.email });

  const passwordcheck = await register.find({ password: req.body.password });
  // const check = await register.find();
  // res.send(check)
  // console.log(emailcheck, "namecheck1");
  // console.log(passwordcheck, "namecheck1");
  // console.log(req.body, "namecheck1");



  // checking input data

  if (emailcheck == "") {
    const msg = "Email not found";
    console.log(msg);
    res.render("login-landing.ejs",{msg:msg});
  } else if (passwordcheck == "") {
    const msg = "Incorrect password";
    console.log(msg);
    res.render("login-landing.ejs",{msg:msg});
  } else {
    res.redirect("/user/home-page");
  }
});






// registration
router.get("/registration", async (req, res) => {
  //  rendering initial page
  res.render("registration.ejs", { msg: "" });
});

router.post("/registration", async (req, res) => {
  //  storing data in tempary schema
  const user_ = new register({
    fullName: req.body.full_name,
    userName: req.body.username,
    email: req.body.email,
    phone_no: req.body.phone_no,
    password: req.body.password,
    conf_password: req.body.conf_password,
    gender: req.body.gender,
  });

  //   checking input data
  const namecheck = await register.find({ userName: req.body.username });

  const emailcheck = await register.find({ email: req.body.email });

  const phonecheck = await register.find({ phone_no: req.body.phone_no });
  // console.log(namecheck, "namecheck1");
  // console.log(emailcheck, "namecheck1");
  // console.log(phonecheck, "namecheck1");
  // console.log(namecheck=="", "namecheck3");
  // console.log(emailcheck=="", "namecheck3");
  // console.log(phonecheck=="", "namecheck3");

  if (namecheck != "") {
    const msg = "User name already exists";
    console.log(msg);
    res.render("registration.ejs", { msg: msg });
  } else if (emailcheck != "") {
    const msg = "Email is already registered";
    console.log(msg);
    res.render("registration.ejs", { msg: msg });
  } else if (phonecheck != "") {
    const msg = "Phone number is already registered";
    console.log(msg);
    res.render("registration.ejs", { msg: msg });
  } else if (req.body.password != req.body.conf_password) {
    const msg = "Password is not a match";
    console.log(msg);
    res.render("registration.ejs", { msg: " Confirm password is not a match" });
  } else {
    res.redirect("/user/home-page");
    user_.save();
  }
});

// user home pages
router.get("/home-page", async (req, res) => {
  res.render("landing-home-post-login.ejs");
});

// landing pages
router.get("/main-page", async (req, res) => {
  res.render("landing-home.ejs");
});

// fundraiser pages
router.get("/fundraiser", async (req, res) => {
  res.render("fundraiser-home.ejs");
});

router.get("/fundraiser-logged-in", async (req, res) => {
  res.render("fundraiser-home-post-login.ejs");
});
module.exports = router;
