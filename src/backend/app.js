//importation
//will contain the express app
const express = require('express');

//creating express app. It's a chain of middleware. 
//EACH PART OF TTHE FUNNEL DO SOMETHING WITH THE REQUEST
const app = express(); 

app.use((req, res, next)=>{
    //sending back a response
    //ends the response implicitely
  res.send('hello from express')
});

//exporting the express app (const and all the middleware
//const stay the same even with new middleware)
module.exports = app;