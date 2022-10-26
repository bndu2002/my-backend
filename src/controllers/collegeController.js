const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const{isValidName , isValidRequestBody , isPresent , isValidLink } = require('../validator/validator')


const createCollege= async function(req,res){
    try {
        const {name,fullName,logoLink,isDeleted}= req.body
       
        if(!isValidRequestBody(req.body))return res.status(400).send({status:false , message:"No Input"})
       
        if(!isPresent(name))return res.status(400).send({status:false , message:"Name Is Required"})
        
        //.test() : regex method ,called upon a regex object (isValidName , here) ,match text/String with the patterns ,return Boolean
        if(!isValidName.test(name))return res.status(400).send({status:false , message:"Please Enter A Valid Name"})
        
        if(!isPresent(fullName))return res.status(400).send({status:false , message:"Full Name Is Required"})
       
        if(!isValidName.test(fullName))return res.status(400).send({status:false , message:"Please Enter A Valid Full Name"})

        let duplicateCollege = await collegeModel.findOne({$or:[{name : name},{fullName:fullName}]})
        if(duplicateCollege)return res.status(400).send({status:false,message : "College Already Exists"})

        if(!isPresent(logoLink))return res.status(400).send({status:false , message:"LogoLink Is Required"})

        if(!isValidLink.test(logoLink))return res.status(400).send({status:false ,message:"Please Enter A Valid LogoLink"})

        if(isDeleted === true)return res.status(400).send({status:false ,message:"Deletion Prohibited While Creation"})
        
        const saveCollege= await collegeModel.create(req.body)

        return res.status(201).send({status:true, message:"successfully created",data:saveCollege})
        
    } catch (error) {
        return res.status(500).send({status:false, message:error.message })
    }
    
}

const getCollegDetails = async function(req,res){
    try {
        let data = req.query
       
        if(Object.keys(data).length === 0)return res.status(400).send({status:false,message:"Select Filter"})
        
        let findCollege = await collegeModel.findOne({name : data.collegeName})
        
        if(!findCollege )return res.status(404).send({status:false , message : ` Oops! College With Name ${data.collegeName} Does Not Exist.`})
         
        //extracted needed keys from findCollege
        let {name,fullName,logoLink} = findCollege
        
        let findIntern = await internModel.find({collegeId : findCollege._id}).select({_id:1 , name:1 ,email:1 , mobile:1})

        let collegeDetails = {
            name,
            fullName,
            logoLink,
            interns:`No Intern Has Applied To ${data.collegeName}.`
        }
       
        //if foundInterns present, change the value of interns
        if(findIntern.length > 0){collegeDetails["interns"] = findIntern}
        
        //else send 53-57 as it is
        return res.status(200).send({ status: true, data: collegeDetails })
        
        } catch (error) {
       return res.status(500).send({status:false, message:error.message })
    }
}

module.exports= {createCollege,getCollegDetails}
