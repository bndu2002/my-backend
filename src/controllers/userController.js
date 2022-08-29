const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


const createUser = async function (req, res) {
  const userData = req.body;
  const saveUser = await userModel.create(userData);
  res.send({ msg: saveUser });
};

//___________________________________________________________________________________________

const loginUser = async function (req, res) {
  // const userEmail = req.body.emailId;
  // const password = req.body.password;
  // const detailVerification = await userModel.findOne({
  //   emailId: userEmail,
  //   password: password,
  // });
  // if (!detailVerification) {
  //   return res.send({
  //     status: false,
  //     msg: "user email id or password is invalid",
  //   });
  // }
  
  let token = jwt.sign(
    {
      userid: detailVerification._id.toString(),
      batch: "plutonium",
      platform: "functionUp",
      batchEnd: "18-nov-2022",
    },
    "unique-secret"
  );



  res.send({ status: true, token: token });
};

//________________________________________________________________________________________________________________________

const getDetails = async function (req, res) {
  //  let token = req.headers["x-auth-token"];
  //  if (!token) token = req.headers["x-Auth-token"];

  // // if (!token) {
  // //   return res.send({ status: false, msg: "missing a mandatory header" });
  // // }

  // let decode = jwt.verify(token, "unique-secret");
  // if (!decode) {
  //   return res.send({ msg: "you are getting an invalid token" });
  // }

  

  // let userId = req.params.userId;
   let userDetails = await userModel.findById(req.userId);
  // if (!userDetails) {
  //   return res.send({ msg: "user does not exist" });
  // }
  res.send({ msg: userDetails });
};

//__________________________________________________________________________________________________________________

const updateUser = async function(req,res){
//   let token = req.headers["x-auth-token"];
//   if(!token) token = req.headers["x-Auth-token"];
//   if(!token){
//     return res.send({msg: " inserted token is invalid"})
//   }
 //let userId = req.params.userId
// let user = await userModel.find({_id : userId })
// if(!user){
//   return res.send("user is not present")
// }
let userData = req.body
let updateUser = await userModel.findByIdAndUpdate({_id :req.userId  }, userData,{new :true});
res.send({status : true , msg:updateUser})

}

//__________________________________________________________________________________________________________________

const deleteUser = async function(req,res){
//   let token = req.headers["x-auth-token"];
//   if(!token) token = req.headers["x-Auth-token"];
//   if(!token){
//     return res.send({msg: " inserted token is invalid"})
//   }
 //let userId = req.params.userId
// let user = await userModel.find({_id : userId })
// if(!user){
//   return res.send("user is not present")
// }
let deletedUser = await userModel.findOneAndUpdate({_id :req.userId },{$set :{isDeleted : true}},{new : true})
res.send({status : "deleted user" , msg : deletedUser })

}



module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getDetails = getDetails;
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
