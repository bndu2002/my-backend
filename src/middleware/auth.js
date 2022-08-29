const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");


//checking users credentials (password && emailid)
const userVerification = async function(req,res,next){
   const userEmail = req.body.emailId;
  const password = req.body.password;
  const detailVerification = await userModel.findOne({
    emailId: userEmail,
    password: password,
  });
  if (!detailVerification) {
    return res.send({
      status: false,
      msg: "user email id or password is invalid",
    });
  }
  next()
};

//__________________________________________________________________________________________________________________

//validating users token (presence && verification) , checking the existence of the user with the given _id 
const tokenValidation = async function(req,res,next){
    let token = req.headers["x-auth-token"];
    
  if (!token) token = req.headers["x-Auth-token"];

  if (!token) {
    return res.send({ status: false, msg: "missing a mandatory header" });
  }


  // [TA : MANASVI SHARMA]
  // handle the error using following function to prevent the server crash 
  // will send the error in the response
  
  
  // ------------------- 1 --------------------
  // (substitue of try and catch)
 
  // let decode = jwt.verify(token, "unique-secret",function(error,decode){
  //   if(error){return res.send({msg : error.message})}else{next()}
  // });

 
  // --------------------2----------------------
 
  // try and catch to get the error related to token in the response itself,(which we were getting in the console before and the app was crashing ) 
  
  // try 
  //  {
  //    let decode = jwt.verify(token, "unique-secret");
  //  }catch(error){
  //     return res.send({msg : error.message})
  //  }
  // if (!decode) {
  //   return res.send({ msg: "you are getting an invalid token" });
  // }
  
  
 // AUTHENTICATION
  let decode = jwt.verify(token, "unique-secret")
  if (!decode) {
      return res.send({ msg: "you are getting an invalid token" });
    }
   req.decode = decode 
  
  //let userId= req.params.userId;
  req.userId = req.params.userId
  let userDetails = await userModel.findById(req.userId);
  if (!userDetails) {
    return res.send({ msg: "user does not exist" });
  }
  
  next()
};

//____________________________________________________________________________________________________________________
const userAuthorisation = function(req,res,next){
  let loggedInUser = req.decode.userid
  let userId = req.params.userId;
  if(userId !== loggedInUser){
    return res.send({status : false , msg : "you are not allowed for this operation"})
  }
  next()

}

//user logged in == user whose details are being requested

module.exports.userVerification = userVerification
module.exports.tokenValidation = tokenValidation
module.exports.userAuthorisation = userAuthorisation