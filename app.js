require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');   
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const port= 3000
const app=express()
const _ = require('lodash');
app.set('view engine', 'ejs');
app.use(express.static("public"))
const https=require('https')
app.use(bodyParser.urlencoded({extended: true}))
const sendMail=require('./mail')
app.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect('mongodb://localhost:27017/foodUserdb', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const fooduserSchema= new mongoose.Schema({
    username: String,
    name: String,
    pwd: String
})
fooduserSchema.plugin(passportLocalMongoose);


const User = new mongoose.model("foodUser", fooduserSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',(req,res)=>
{
  res.render('main')
})

app.get('/recipes',(req,res)=>
{
  if(req.isAuthenticated())
  {
    res.render('recipes',{username: req.user.name})
  }
  else
  {
    res.render('login')
  }
  
})
app.get('/recipes/:customListName', (req,res)=>
{
  cuisine=req.params.customListName
  res.render("types",{mycuisine: _.capitalize(cuisine)});
})
app.get('/register',(req,res)=>
{
  res.render('register');
})

app.get('/login',(req,res)=>
{
  res.render('login');
})
app.post("/recipes/:cuisine/:dishname",(req,res)=>
{
  const url=`https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${req.params.cuisine}&type=${req.params.dishname}`
  https.get(url, (resp)=>
  {
    var data;
     
      resp.on("data", (chunk) => {
     

              if (!data) {
                data = chunk;
              } else {
                data += chunk;
              }
              });
        
            resp.on("end", function() {
                const currency=JSON.parse(data);
              
                const a=Math.ceil(currency.results.length/3)
                res.render("dishes",{mydish: _.capitalize(req.params.dishname), dishes: currency.results, rows: a});
            });
})
})

app.post('/recipe-info/:id',(req,res)=>
{
  const url=`https://api.spoonacular.com/recipes/${req.params.id}/analyzedInstructions?apiKey=514580f415394925bff2425d6cbd9f24`;
  https.get(url, (resp)=>
  {
    var data;
     
      resp.on("data", (chunk) => {
     

              if (!data) {
                data = chunk;
              } else {
                data += chunk;
              }
              });
        
            resp.on("end", function() {
                const currency=JSON.parse(data);
                
                res.render("info",{mydata: currency});
            });
})
  

});
app.post('/register',(req,res,next)=>
{
  
  User.register({username:req.body.username, name: req.body.email},req.body.password,(err,user)=>
  {
    if(err)
    {
      console.log(err);
      res.redirect('/register');
    }
    else
       {
            
           passport.authenticate('local')(req,res,function(err){ // this uthenticates the user using local strategy which means authenticationg using username and pwd
             if(err)
             console.log(err)
             else 
               res.redirect('/recipes')
           });
       }
  })
});
app.post('/login',(req,res)=>
{
  const user = new User({
    username: req.body.username,
    pwd: req.body.password
})

req.login(user, function(err)
{
  
    if(err)
    console.log(err)
    else
    {
        passport.authenticate('local')(req,res,function(err) 
        {
           
            res.redirect('/recipes')
           
        })
    }
})
});
app.get('/logout',(req,res)=>
{
    req.logout()
    res.redirect('/')
})
app.get('/about',(req,res)=>
{
  res.render('about')
})
app.get('/contact',(req,res)=>
{
  res.render('contact')
})
app.post('/email',(req,res)=>
{
  const {email,message}=req.body; 
  console.log(req.body)
  sendMail(email,message,function(err,data)
  {
    if(err)
    {
      res.status(500).json({response: 'we have an error'})
    }else
    {
      res.json({response:"email sent!"})
    }
  });
})
app.listen(3000,()=>
{
  console.log('listening at http://localhost:3000/')
})