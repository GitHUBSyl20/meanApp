//importation
//will contain the express app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var morgan = require("morgan");



const postsRoutes = require('./routes/posts')

//creating express app. It's a chain of middleware. 
//EACH PART OF TTHE FUNNEL DO SOMETHING WITH THE REQUEST
const app = express();
app.use(morgan('dev'));

//let's connect to the database
mongoose.connect("mongodb+srv://syl20:vm8gCOCS9ol7FpRE@cluster0-jfodh.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('connected to database')
  })
  .catch(() => {
    console.log('connection failed')
  });

//return a valid express middleware to parse a json data
app.use(bodyParser.json());

//for all incoming request whatever its origin
app.use((req, res, next) => {
  //alllowing acces to the ressource whatever the origin of ot (*)
  //which domain is allowed to acces our ressources
  res.setHeader("Access-Control-Allow-Origin", "*");
  //similar but with certain type of request header
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    //option is send by default to check validity of the request
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
})

app.use("/api/posts", postsRoutes)

//exporting the express app (const and all the middleware
//const stay the same even with new middleware)
module.exports = app;