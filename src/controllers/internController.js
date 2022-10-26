const { findOne } = require('../models/collegeModel')
const collegeModel = require('../models/collegeModel')
const internModel = require("../models/internModel")
const{isValidName , isValidRequestBody , isPresent , isValidMail ,isValidNumber} = require('../validator/validator')

const createIntern = async function(req,res){
try {
    let {name,mobile,email,collegeName,isDeleted} = req.body
    
    if(!isValidRequestBody(req.body))return res.status(400).send({status:false,msg:"No Input"})

    if(!isPresent(name)) return res.status(400).send({status:false,msg:"Name Is Required"})
    
    if(!isValidName.test(name))return res.status(400).send({status:false,msg:"Please Enter A Valid Name"})

    if(!isPresent(mobile))return res.status(400).send({status:false,msg:"Mobile Number Is Required"})

    if(!isValidNumber.test(mobile))return res.status(400).send({status:false,msg:"Please Enter A Valid Mobile Number"})
    
    if(!isPresent(email))return res.status(400).send({status:false,msg:"Email Is Required"})

    if(!isValidMail.test(email))return  res.status(400).send({status:false,msg:"Please Enter A Valid Email"})

    let duplicateEmail = await internModel.findOne({email : email})
    if( duplicateEmail )return res.status(400).send({status:false , msg : "User With This Email Already Exists"})
    //want to check for number & email in one db call HOW??
    let duplicateNumber = await internModel.findOne({mobile:mobile})
    if (duplicateNumber)return res.status(400).send({status:false , msg : "User With This Mobile Number Already Exists"})
   
    if(!isPresent(collegeName))return res.status(400).send({status:false , msg : "College Name Is Required"})

    let getCollegeId = await collegeModel.findOne({name : collegeName})

    if(!getCollegeId)return res.status(404).send({status:false , msg : `${collegeName} Does Not Exist`})

    if(isDeleted === true)return res.status(400).send({status:false ,message:"Deletion Prohibited While Creation"})
  
    //created new key "collegeId" ,assigned it value of key getCollegeId which is _id of the college
    req.body.collegeId = getCollegeId._id

    //deleted the "collegeName" key
    delete req.body["collegeName"]
    
    let saveIntern = await internModel.create(req.body)
    return res.status(201).send({status:true, message:"successfully created", data :saveIntern })
}
 catch (error) {
   return res.status(500).send({status:false,message:error.message})
}

}

module.exports.createIntern = createIntern
