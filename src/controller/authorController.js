// const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const { isValid } = require("../validator/validations")
const validator = require('validator')
const jwt= require("jsonwebtoken")
//*******************************************CREATE AUTHOR **************************/
const createAuthor = async function (req,res){
    try{
        let data = req.body
        let {fname,lname,title,email,password} = data
       // require mendatory 
        if (!isValid(fname)) return res.status(400).send({ status: false, message: "first-name is required" })

        if (!isValid(lname)) return res.status(400).send({ status: false, message: "last-name is required" })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "title-Name is required" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "password is required" })

        if(!validator.isEmail(email.trim())) return res.status(400).send({ status: false, msg: "it's an invalid email address!" })


        let validFname = validator.isAlpha(fname);
        let validLname = validator.isAlpha(lname);
    
        if (validFname == false || validLname == false)
          return res.status(400).send({ status: false, msg: "LastName and firstName must be in alphabat", });
    


        let checkEmail = await authorModel.findOne({email: email})
        if (checkEmail) return res.status(400).send({status: false, message: "email is already exist"})
        const resultData = await authorModel.create(data)
        return res.status(201).send(resultData)
    }catch(error){
        res.status(500).send({staus: false , message :err.message})
    }
}

//*******************************************LOGIN **************************/

let loginAuthor = async function (req, res) {
    try {
      let data = req.body;
      let { email, password } = data;
  
      if (!isValid(email)) {
        return res.status(400).send({ status: false, msg: " email is required" });
      }
      if (!isValid(password)) {
        return res.status(400).send({ status: false, msg: " password is required" });
      }
  
      if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, msg: "You have entered an invalid email address!" });
  
      let validateEmail = await authorModel.findOne({ email: email.trim() });

      if (!validateEmail) return res.status(404).send({ status: false, msg: "user not found" });
  
      if (validateEmail.password != password)
        return res.status(401).send({ status: false, msg: "invalid password" });
  
      let key = jwt.sign(
        {id: validateEmail._id.toString()},"GAS-project-1-team-16");
  
      res.setHeader("x-api-key", key);
      res.status(200).send({ status: true, key: key });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  };
  
  module.exports = { loginAuthor, createAuthor }