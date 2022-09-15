const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const{isValidName , isValidRequestBody , isValid , isValidLink} = require('../validator/validator')


const createCollege= async function(req,res){
    try {
        const {name,fullName,logoLink}= req.body
       
        if(!isValidRequestBody(req.body))return res.status(400).send({status:false , msg:"No Input"})
       
        if(!isValid(name))return res.status(400).send({status:false , msg:"Name Is Required"})
        
        //.test() : regex method ,called upon a regex object (isValidName , here) ,match text/String with the patterns ,return Boolean
        if(!isValidName.test(name))return res.status(400).send({status:false , msg:"Please Enter A Valid Name"})
        
        if(!isValid(fullName))return res.status(400).send({status:false , msg:"Full Name Is Required"})
       
        if(!isValidName.test(fullName))return res.status(400).send({status:false , msg:"Please Enter A Valid Full Name"})

        if(!isValid(logoLink))return res.status(400).send({status:false , msg:"LogoLink Is Required"})

        if(!isValidLink.test(logoLink))return res.status(400).send({status:false , msg:"Please Enter A Valid LogoLink"})
        
        const saveInter= await collegeModel.create(req.body)

        res.status(201).send({status:true, message:"successfully created",data:saveInter})
        
    } catch (error) {
        res.status(500).send({status:false, message:error.message })
    }
    
}

const getCollegDetails = async function(req,res){
    try {
        let data = req.query

        if(Object.keys(data).length === 0)return res.status(400).send({status:false,msg:"Select Filter"})
        
        let findCollege = await collegeModel.findOne({name : data.collegeName})
       
        if(!findCollege )return res.status(400).send({status:false , message : "no such college exists"})

        //extracted needed keys from findCollege
        let {name,fullName,logoLink} = findCollege
        
        let findIntern = await internModel.find({collegeId : findCollege._id}).select({_id:1 , name:1 ,email:1 , mobile:1})

        let arr = {
            name,
            fullName,
            logoLink,
        }
       
        //if no intern , add a new  key interns in the arr object with a message as a value
        if(!findIntern.length > 0){
             arr["interns"] = "No Intern Has Applied To This College"
             return res.status(200).send({ status: true, data: arr })
        }
        
        //else all keys and add key interns : findIntern
          arr["interns"] = findIntern
       
       
        return res.status(200).send({ status: true, data: arr })
        
        } catch (error) {
        res.status(500).send({status:false, message:error.message })
    }
}

module.exports= {createCollege,getCollegDetails}