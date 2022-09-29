const { render } = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");
const multer = require("multer")
const app = express();
const http = require("http").createServer(app);
const formidable = require("formidable");
const fs = require("fs");
const Razorpay = require("razorpay")
// const stripe =require("stripe")("secret_key")
const domain ="http://localhost:3000"
var instance = new Razorpay({ key_id: 'rzp_test_WxRaJpBIMBim6H', key_secret: '64L2zfnhaDQTE4kexFju1OPG' })


const startFund = require("../model_web/start-fundraiser");
const { resourceLimits } = require("worker_threads");
// const donarInfo = require("../model_web/donate");
const donarRazorpay = require("../model_web/donate-razorpay");
const donate = require("../model_web/donate");
const { bool } = require("joi");

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// database connection
const uri ="mongodb+srv://raj4321:YIfQx247fYNf0YW0@braincellsdb.ajb1asy.mongodb.net/?retryWrites=true&w=majority";
// const uri_2 ="mongodb://raj4321:YIfQx247fYNf0YW0@ac-lvdgsyz-shard-00-00.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-01.ajb1asy.mongodb.net:27017,ac-lvdgsyz-shard-00-02.ajb1asy.mongodb.net:27017/?ssl=true&replicaSet=atlas-n2mj96-shard-0&authSource=admin&retryWrites=true&w=majority";
const db = mongoose.connect(uri)
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
router.use(
  "/file",
  express.static(path.join(__dirname, "../public/img_fund"))
);
console.log(path.join(__dirname, "../public/img_fund"))

// disk storage
const Storage =multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, (path.join(__dirname, "../public/img_fund")))
  },
  filename:(req,file,cb) => {
    var FILEname = file.originalname.substring(0, file.originalname.length - 4) 
  
    cb(null,Date.now() + "--" + FILEname + path.extname(file.originalname))
  },
})

const upload =multer({
  storage:Storage
}).single("uploaded_file")


// Set views for website

app.set("views", path.join(__dirname, "../views_web"));
app.set("view engine", "ejs");




// login
router.get("/start-funding", async (req, res) => {
  res.render("start-fundraiser.ejs",{msg:""});
});

router.post("/start-funding",upload,async (req, res) => {
//  storing data in tempary schema
console.log("hello 1")

  // const formData = new formidable.IncomingForm()
  // formData.parse(req, function(error,fields,files){
  //   const extension = files.file.name.substr(files.filename.name.lastIndexOf("."))
  //   const newPath = "file" + extension
  //   console.log("hello 2")
  //   fs.rename(files.file.path, newPath, function(errorRename){
  //     result.send("File saved")
  //     console.log("hello 3")

  //   })
  //   console.log(newPath,"hello")
  //   console.log(extension,"bye")


  
  // })
  


console.log(req.file.filename,"fafffffffffff")

        const user_ = new startFund({
          cause: req.body.cause,
          name: req.body.name,
            email: req.body.email,
            phone_no: req.body.phone_no,
            problem_statement: req.body.prob_statement,
            problem_description: req.body.prob_description,
            Amount: req.body.target_amount,
            image: req.file.filename,
          });
          user_.save()
      // }
    // })
    
    console.log(req.body,"hhhhhhhhhhhhhh")
    // alert("success! Your fund raiser is created" + res.status)
    res.redirect("/fund/donate")
  
});
  
  







// fundraiser pages
router.get("/fundraiser", async (req, res) => {
  res.render("fundraiser-home.ejs");
});

router.get("/fundraiser-logged-in", async (req, res) => {
  res.render("fundraiser-home-post-login.ejs");
});

// donation pages
router.get("/donate", async (req, res) => {
  const fundInfo = await startFund.find()
  const fundInfoReverse = fundInfo.reverse()
  res.render("donate.ejs",{fund_info:fundInfoReverse,msg:""});

});

// donation pages post login
router.get("/donate-logged-in", async (req, res) => {
  const fundInfo = await startFund.find()
  const fundInfoReverse = fundInfo.reverse()
  res.render("donate-post-login.ejs",{fund_info:fundInfoReverse,msg:""});

});

// contact us pages
router.get("/contact-us-logged-in", async (req, res) => {
  res.render("contact-post-login.ejs");
});


router.get("/demo-pay", async (req, res) => {
  res.render("donate-pay.ejs");
});




router.get("/donate-home", async (req, res) => {
  const fundInfo = await startFund.find()
  const fundInfoReverse = fundInfo.reverse()
  res.render("donate.ejs",{fund_info:fundInfoReverse,msg:""});

  // res.render("donate.ejs");
});

router.post("/donate-post-payment", async (req, res) => {
  const fundInfo = await startFund.find()
  const fundInfoReverse = fundInfo.reverse()
  res.render("donate.ejs",{fund_info:fundInfoReverse,msg:"Your transaction is a success, thank you for donating."});

  // res.render("donate.ejs");
});

router.get("/login-signup", async (req, res) => {
  res.render("fundraiser-login-signup.ejs",{msg:"",msg_login:""});
});

router.post("/login-signup", async (req, res) => {
  console.log(req.body.signup_email)
 if (req.body.signup_email){
    console.log("inside if")
    const namecheck = await donate.find({ fullName: req.body.signup_name });

    const emailcheck = await donate.find({ email: req.body.signup_email });
  
    const passwordcheck = await donate.find({ password: req.body.signup_password });
  
    
        

    const user_ = new donate({
      fullName: req.body.signup_name,
      email: req.body.signup_email,
      password: req.body.signup_password,
      conf_password: req.body.signup_conf_password,
    });
    console.log(user_,"user")
   

    if (namecheck != "") {
      const msg = "User name already exists";
      console.log(msg);
      res.render("fundraiser-login-signup.ejs", { msg: msg });
    } else if (emailcheck != "") {
      const msg = "Email is already registered";
      console.log(msg);
      res.render("fundraiser-login-signup.ejs", { msg: msg});
    } else if (req.body.signup_password != req.body.signup_conf_password) {
      const msg = "Password is not a match";
      console.log(msg);
      res.render("fundraiser-login-signup.ejs", { msg: " Confirm password is not a match" });
    } else {
      res.redirect("/fund/fundraiser-logged-in");
      user_.save();
    }
    


  } else {
    console.log("inside else")

    const emailcheck = await donate.find({ email: req.body.email_login });
  
    const passwordcheck = await donate.find({ password: req.body.password_login });
  
    
   

    if (emailcheck == "") {
      const msg = "Email not found";
      console.log(msg);
      res.render("fundraiser-login-signup.ejs",{msg:msg});
    } else if (passwordcheck == "") {
      const msg = "Incorrect password";
      console.log(msg);
      res.render("fundraiser-login-signup.ejs",{msg:msg});
    } else {
      res.redirect("/fund/fundraiser-logged-in");
    }
  }
  // res.send("hello");
});

router.post("/payment-gateway", async (req, res) => {
  console.log(req.body)
  res.send("hello");
});


// demo
router.get("/donate-option/:id", async (req, res) => {
  // startFundraiser.find({},function(funds){
  //   res.render("demo.ejs",{FundList:startFundraiser});
  // })
  console.log(req.params.id)
  // const fundInfo = await startFund.find()
  res.render("razorpay-payment.ejs",{fund_info:req.params.id})
  // res.render("razorpay-demo.ejs",{fund_info:req.params.id})
});


router.get("/payment/:id", async (req, res) => {
  const razor_pay = await donarRazorpay.findOneAndRemove()
  
  const fundInfo = await startFund.find({problem_statement:req.params.id})
  console.log(fundInfo,"fffffffffffffffffuuuuuuuuuuuuuuuuunnnnnnnnnn")
  console.log(razor_pay,"payment")
  var options = {
    amount: razor_pay.amount*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  var orderID= "hi"
  console.log(options,"ji")
  await instance.orders.create(options, async function(err, order) {
    console.log(order);
    orderID=order.id
   
     });
     var allOrders = await instance.orders.all()
    Element = allOrders.items[0].id
    // console.log(allOrders,"ffffffffffffffffffffffff")
    console.log(Element,"ffffffffffffffffffffffff")
 
  
  res.render("razorpay-pay-option.ejs",{orderid:Element,name:razor_pay.name,email:razor_pay.email,phone:razor_pay.phone,image:fundInfo.image})
});


router.post("/donate-option/:id", async (req, res) => {
  console.log(req.params.id,"jlllll")
  // const fundInfo = await startFund.find({problem_statement : req.params.id})
  const user_ = new donarRazorpay({
    cause:req.params.id,
    name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      
      amount: req.body.amount,
    
    });
    var pay = req.params.id
    console.log(req.body.amount,"amount")

    
    user_.save()
    res.redirect(`/fund/payment/${pay}`)
})

router.post("/payment/:id", async (req, res) => {
  
  var options = {
    amount: req.body.amount*100,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  var orderID= "hi"
  console.log(options)
  instance.orders.create(options, function(err, order) {
    console.log(order);
    orderID=order.id
    console.log(orderID,"ffffffffffffffffffffffff")
    res.send({orderId:orderID,amount:options.amount}) 
  });

  
  

  // instance.orders.create(options, function(err, order) {
  //   console.log(order);
  // });
  console.log(req.body)  
  console.log(orderID)  


});









module.exports = router;
