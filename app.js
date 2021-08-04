const express = require('express')
const bodyParser= require('body-parser')
const port= 3000
const app=express()
const _ = require('lodash')
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.static("public"))
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/foodUserdb', {useNewUrlParser: true, useUnifiedTopology: true});
const https=require('https')

app.get('/',(req,res)=>
{
  res.render('main')
})

app.get('/recipes',(req,res)=>
{
 
  res.render('recipes')
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
  const url=`https://api.spoonacular.com/recipes/complexSearch?apiKey=514580f415394925bff2425d6cbd9f24&cuisine=${req.params.cuisine}&type=${req.params.dishname}`
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


app.listen(3000,()=>
{
  console.log('listening at http://localhost:3000/')
})