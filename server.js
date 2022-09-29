const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3000;
const app = express();
const server = express();

// database connection
const uri ="mongodb+srv://raj4321:YIfQx247fYNf0YW0@braincellsdb.ajb1asy.mongodb.net/?retryWrites=true&w=majority";
// const uri_2 ="mongodb://raj4321:YIfQx247fYNf0YW0@ac-lvdgsyz-shard-00-00.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-01.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-02.ajb1asy.mongodb.net:27017/?ssl=true&replicaSet=atlas-n2mj96-shard-0&authSource=admin&retryWrites=true&w=majority";
const db = mongoose.connect(uri);
const con = mongoose.connection;

// login route
const loginRoute = require("./routes_web/login");
const fundRoute = require("./routes_web/fund-raiser");
const google_logIn = require("./routes_web/passport-google");
const facebook_logIn = require("./routes_web/passport-facebook");
const twitter_logIn = require("./routes_web/passport-twitter");

app.use("/user", loginRoute);
app.use("/fund", fundRoute);
app.use("/login", google_logIn);
app.use("/login", facebook_logIn);
app.use("/login", twitter_logIn);

// fund-raiser route
const fund_raiserRoute = require("./routes_web/fund-raiser");
const { Passport } = require("passport");
app.use("/funds", fund_raiserRoute);

// connected
con.on("open", function () {
  console.log("connected...");
});

// idk
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// staticfiles

app.use("/css_web", express.static(path.join(__dirname, "public/css_web")));
app.use("/js_web", express.static(path.join(__dirname, "public/js_web")));
app.use("/img_web", express.static(path.join(__dirname, "public/img_web")));

console.log(path.join(__dirname, "public/css_web"))

// Set views for website

app.set("views", path.join(__dirname, "views_web"));
app.set("view engine", "ejs");

// end points

app.get("/login", (req, res) => {
  res.render("login-landing.ejs");
});

app.get("/register", (req, res) => {
  res.render("registration.ejs");
});

app.get("/home", (req, res) => {
  res.render("landing-home.ejs");
});

app.get("/about-us", (req, res) => {
  res.render("about us.ejs");
});

app.get("/about-logged-in", (req, res) => {
  res.render("about-us-post-login.ejs");
});

app.get("/blog", (req, res) => {
  res.render("blog.ejs");
});


app.get("/create-blog", (req, res) => {
  res.render("create-blog.ejs");
});


app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.post("/contact", (req, res) => {
  console.log(req.body)

 
  // function SendMail(){
  //   var params ={
  //     from_name : document.getElementById("fullName").value,
  //     email_id : document.getElementById("email_id").value,
  //     message : document.getElementById("message").value,

  //   }
  //   emailjs.send("service_wx5dz3f","template_tu58abm",params).then(function (res){
  //     alert("success!" + res.status)
  //   })
  // }

});

app.get("/blog-logged-in", (req, res) => {
  res.render("blog-post-login.ejs");
});

app.get("/contact-logged-in", (req, res) => {
  res.render("contact-post-login.ejs");
});

// user home pages
app.get("/home-page", async (req, res) => {
  res.render("landing-home-post-login.ejs");
});

// landing pages
app.get("/main-page", async (req, res) => {
  res.render("landing-home.ejs");
});


app.get("/designing",(req,res) =>{
  res.render("razorpay-demo.ejs")
})

app.listen(port, () => {
  console.log("server started");
});

app.post("/api/payment/verify", (req, res) => {
  let body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto
    .createHmac("sha256", "<YOUR_API_SECRET>")
    .update(body.toString())
    .digest("hex");
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  var response = { signatureIsValid: "false" };
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { signatureIsValid: "true" };
  res.send(response);
});
