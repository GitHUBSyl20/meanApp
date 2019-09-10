//importation
const express = require('express');

//creating express app. It's a chain of middleware. EACH PART OF TTHE FUNNLE DO SPMETJING WITH THE REQUEST
const app= express(); 


app.use('/api/posts', (req, res, next)=>{
    //sending back a response
    //ends the response implicitely
  res.send('hello from express')
});

//exporting the express app (const and all the middleware
//const stay the same even wxith new middleware)
module.exports = app; 