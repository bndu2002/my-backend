const collegeModel = require('../models/collegeModel')
const internModel = require("../models/internModel")
const{isValidName , isValidRequestBody , isValid , isValidMail ,isValidNumber} = require('../validator/validator')

const createIntern = async function(req,res){
try {
    let {name,mobile,email,collegeName} = req.body
    
    if(!isValidRequestBody(req.body))return res.status(400).send({status:false,msg:"No Input"})

    if(!isValid(name)) return res.status(400).send({status:false,msg:"Name Is Required"})
    
    if(!isValidName.test(name))return res.status(400).send({status:false,msg:"Please Enter A Valid Name"})

    if(!isValid(mobile))return res.status(400).send({status:false,msg:"Mobile Number Is Required"})

    if(!isValidNumber.test(mobile))return res.status(400).send({status:false,msg:"Please Enter A Valid Mobile Number"})
    
    if(!isValid(email))return res.status(400).send({status:false,msg:"Email Is Required"})

    if(!isValidMail.test(email))return  res.status(400).send({status:false,msg:"Please Enter A Valid Email"})

    let duplicateEmailNumber = await internModel.findOne({$or:[{email : email},{mobile:mobile}]})
   
    
    
    if( duplicateEmailNumber.email == email )return res.status(400).send({status:false , msg : "User With This Email Already Exists"})
    
    if(duplicateEmailNumber.mobile == mobile)return res.status(400).send({status:false , msg : "Enter A Unique Mobile Number"})
   
    if(!isValid(collegeName))return res.status(400).send({status:false , msg : "College Name Is Required"})

    let getCollegeId = await collegeModel.findOne({name : collegeName})

    if(!getCollegeId)return res.status(400).send({status:false , msg : "No Such College Exists"})
  
    //created new key "collegeId" ,assigned it value of key getCollegeId which is _id of the college
    req.body.collegeId = getCollegeId._id

    //deleted the "collegeName" key
    delete req.body["collegeName"]
    
    let saveIntern = await internModel.create(req.body)
    res.status(201).send({status:true, message:"successfully created", data :saveIntern })
}
 catch (error) {
    res.status(500).send({status:false,message:error.message})
}

}

module.exports.createIntern = createIntern