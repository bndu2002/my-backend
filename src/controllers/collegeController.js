const mongoose= require('mongoose')
const collegeModel = require('../models/collegeModel')
//const CollegeModel= require("../")

const createCollege= async function(req,res){
    try {
        const data= req.body
        const save= await collegeModel.create(data)
        res.status(201).send({status:true, message:"successfully created",data:save})
        
    } catch (error) {
        res.status(500).send({status:false, message:error.message })
    }
    
}

module.exports={createCollege}