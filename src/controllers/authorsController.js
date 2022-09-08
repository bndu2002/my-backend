const authorsModel = require("../model/authorsModel");
const jwt = require('jsonwebtoken')

const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let emailAdress = req.body.email;
    if (emailAdress.match(regexEmail)) {
      let createData = await authorsModel.create(data);
      return res.status(201).send({ data: createData });
    }
    return res.status(400).send({ status: false, msg: "wrong email id" });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

const loginAuthor = async function(req,res){
 
 try {
  let email = req.body.email
  let password = req.body.password
  
  if(!email || !password){
    return res.status(400).send({status : false , msg : "email and password is mandatory"})
  }
  

  let verifyAuthor = await authorsModel.findOne({email :  email , password : password })
  if(!verifyAuthor){
    return res.status(400).send({status:false , msg : "email or password is incorrect"})
  }

  let token = jwt.sign(
      { 
        authorId : verifyAuthor._id.toString(),
        project : 1,
        group : 56,
        batch : "Plutonium"
      },
      "thou-hath-the-poer"
  );

  res.status(200).send({status:true , msg : token})
}
catch(error){
  res.status(500).send({status : false , msg : error.message})
}
};



module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor
