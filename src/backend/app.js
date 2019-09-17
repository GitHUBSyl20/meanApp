//importation
//will contain the express app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var morgan = require("morgan");

const Post = require('./models/post');

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

app.post("/api/posts", (req, res, next) => {
  //we use an instance of Post here
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  app.put("/api/posts/:id", (req, res, next) => {
    const post = new Post({
      //reusing the id from the backend
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      console.log(result);
      res.status(200).json({ message: "update successful" })
    });
  });

  //automatically select the right query for the database and insert the corresponding data (post) in the database+ auto id
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post added succesfully",
      postId: createdPost.id,
      post: post
    });
    //everything is ok and a ressource was added (201)
  })
})


app.get("/api/posts", (req, res, next) => {
  //sending back a response
  //ends the response implicitely

  //find: mongoose db methode that returns entry/Can be configure to narrow down the research
  Post.find()
    //asynchronous task needs wait for the reception of data
    .then(documents => {
      console.log(documents)
      res.status(200).json({
        message: 'post fetched sucessfully',
        posts: documents
      })
    });
});

app.get("/api/posts/:id", (req, res, next)=>{
  PostfindById(req.params.id)
    .then(post=>{
    if(post){
      res.status(200).json(post)
    }else{
      res.status(404).json({message: "not found"})
    }
  })
})

//dynamic id segment
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "post deleted" });
  })
})
//exporting the express app (const and all the middleware
//const stay the same even with new middleware)
module.exports = app;