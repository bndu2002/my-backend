
const userModel = require('../models/model.js')

const createUsers = async function(req,res){
    let userData = req.body
    let save = await userModel.create(userData)
    res.send({save})
    
}

const getusers = async function(req,res){
    
    let save = await userModel.find()
    res.send({"data" :save})
}
module.exports.createUsers = createUsers
module.exports.getusers = getusers
