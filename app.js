const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const app = express();
require('dotenv').config();
const saltRounds = 10;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://airaz_alam:"+process.env.MONGODB_ATLAS_PASSWORD+"@cluster0.jzretlj.mongodb.net/userDB")
.then(() => {
    console.info('connected successfully')  
})
.catch(() => {
    console.error('connection error');
});

const userSchema =new mongoose.Schema ({
  email: String,
  password: String
});


const User = mongoose.model("User",userSchema);


app.get("/",function(req,res){

  res.render("home");
    
    
    
  });
app.get("/login",function(req,res){

  res.render("login");
    
    
    
  });
app.get("/register",function(req,res){

  res.render("register");
    
    
    
  });
  app.post("/register",async function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser= new User({
        email: req.body.username,
        password: hash
      });
      newUser.save().then(() => {
        res.render("secrets");
    })
    .catch((error) => {
        console.error(error);
    });
  });
    
});
  app.post("/login",async function(req,res){

    const insertedPassword = req.body.password;
    await User.findOne({email: req.body.username}).then((foundUser) => {
      if(foundUser){
        bcrypt.compare(insertedPassword, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
          else{
            res.send("WRONG EMAIL OR PASSWORD");
          }
      });
        
      }
      else{
        res.send("WRONG EMAIL OR PASSWORD");
      }
  })
  .catch((error) => {
      console.error(error);
  });
      
      
      
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
  
  