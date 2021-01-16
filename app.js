//jshint esversion:6

//' Get Secrets from local environment var.
require("dotenv").config();

//' Get required modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


//' Initialize app
const app = express();

//' Config 'app' to use EJS as view engine, public stuff & bodyParser for parsing.
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));


//' Connect to MongoDB, create new schema and model
mongoose.connect(process.env.MONGODB_URL + "userDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = new mongoose.model("User", userSchema);


//' ROUTES
app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/logout", (req, res)=>{
    res.render("login");
});

app.get("/submit", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    let userName = req.body.username;
    let password = req.body.password;
    console.log(userName + "__" +password);

    bcrypt.hash(password, saltRounds, (err, hash)=>{
        if(!err){
            const newUser = new User({
                email: userName,
                password: hash
            });
        
            newUser.save((err)=>{
                if(!err){
                    res.render("secrets");
                }
                else{
                    console.log("Error: "+ err);
                }
            });

        }
    });    
});

app.post("/login", (req, res)=>{
    const userName = req.body.username;
    const password = req.body.password;
    // console.log(userName +"____" +password);

    User.findOne({email: userName}, (err, foundUser)=>{
        if(!err){
            bcrypt.compare(password, foundUser.password, (err, result)=>{
                if(!err){
                    if(result === true){
                        res.render("secrets"); 
                    }
                    else{
                        console.log("Invalid password!!");
                        res.render("login");
                    }
                }                
            });           
        }
        else{
            console.log("Error: "+ err);
        }
    });
});





//' Sever config
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Server started on port: " + PORT);
});