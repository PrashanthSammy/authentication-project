//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = "thisisalittlesecret";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

// const userq = new User ({
//   email: "sammy@123",
//   password: "sammy@123"
// })

// userq.save();


app.post("/register", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const inputData = new User ({
    email: username,
    password: password
  })

  if (User.find({email:username}) === username) {
    
    console.log("user exists")
    
    res.redirect("register")
  } else{
    inputData.save();
    res.redirect("secrets")
  }
})


app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

 User.findOne({email: username}, function(err, foundItems){
  if (err){
    res.send("check your username")
  } else {
    if (foundItems) {
    if(foundItems.password === password) {
      res.render("secrets");
    } else {
      res.send("check your password")
    }
  }
  }
 })
})

app.get("/", function(req, res){
  res.render("home.ejs")
});


app.get("/login", function(req, res){
  res.render("login.ejs")
});


app.get("/register", function(req, res){
  res.render("register.ejs")
});


// app.get("/secrets", function(req, res){
//   res.render("secrets.ejs")
// });



app.listen(3000, function(){
  console.log("server has started")
});




