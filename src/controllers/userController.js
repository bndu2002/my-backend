const userModel = require("../models/userModel")


const createUser = async function(req,res){
    const user = req.body
    const saveUser = await userModel.create(user)
    res.send({status : true , msg : saveUser})
}

module.exports.createUser = createUser



