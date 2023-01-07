


const jwt = require("jsonwebtoken");



let Authentication = async function(req,res,next){
  try{
    let token = req.headers['x-api-key'];
    if(!token ) return res.status(400).send({status: false, msg:"Authentication token is missing"})
    jwt.verify(token, "GAS-project-1-team-16",function(err,decoded){
      if(err){
        return res.status(500).send({status:false, err: err.message});
      }
      else{
        req.decode = decoded
        console.log( req.decode.id)
        return next();
      }
    })
 
   
  }
  catch(error){
    res.status(500).send({status:false,msg:error.message})
  }
}



module.exports = { Authentication}