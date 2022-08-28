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

  let decode = jwt.verify(token, "unique-secret");
  if (!decode) {
    return res.send({ msg: "you are getting an invalid token" });
  }
  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails) {
    return res.send({ msg: "user does not exist" });
  }

  next()
};

module.exports.userVerification = userVerification
module.exports.tokenValidation = tokenValidation