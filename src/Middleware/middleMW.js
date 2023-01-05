


const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');
const authorModel = require("../models/authorModel")


let Authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)return res.status(400).send({status:false,error: "x-api-key header is required" });

    let decode = jwt.verify(token, "GAS-project-1-team-16");

    req.decode= decode
    console.log(decode)
    next();
  }
   catch (error) {
    return res.status(500).send({ status:false,error: "invalid token" });
  }
};


let AuthorisationById = async function (req, res, next) {
  try {
   
    let blogId = req.params.blogId
    if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, error: 'Invalid blog id' })  
    const blogs= await blogModel.findOne({_id:blogId, isDeleted:false})
    if(!blogs) return res.status(404).send({status: false, error: "blog is not found"})
    let authorid= blogs.authorId
    if(authorid != req.decode.id) return res.status(403).send({status: false, error: "You are not autherised"})  
    next();
  } 
  catch (error) {
    return res.status(500).send({status:false, error: error.message });
  }
};

let AuthorisationToQuery = async function (req, res, next) {
  try {
   
      let data = req.query
      if (Object.keys(data).length == 0) return res.status(404).send({ status: false, Error: "data is required" })    
      data.isDeleted= false
      const getBlog= await blogModel.findOne(data)
      if(getBlog==null) return res.status(404).send({status:false, error: "Blog is not found"})
      let authorid= getBlog.authorId
      if(authorid!=req.decode.id) return res.status(403).send({status: false, error: "You are not autherised"})  
      next();
  } 
  catch (error) {
    return res.status(500).send({status:false,message:error.message});
   }
};


module.exports = { Authentication, AuthorisationById, AuthorisationToQuery }