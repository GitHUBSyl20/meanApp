const express = require("express"); 
const Post = require('../models/post');

const router = express.Router()

//stripping the path and filtering it the posts route file
router.post("", (req, res, next) => {
    //we use an instance of Post here
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
  
    router.put("/:id", (req, res, next) => {
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
  
  //préfiltering of the url route in the posts files 
  router.get("", (req, res, next) => {
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
  
  router.get("/:id", (req, res, next)=>{
    Post.findById(req.params.id)
      .then(post=>{
      if(post){
        res.status(200).json(post)
      }else{
        res.status(404).json({message: "not found"})
      }
    })
  })
  
  //dynamic id segment
  router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "post deleted" });
    })
  })

  module.exports= router
