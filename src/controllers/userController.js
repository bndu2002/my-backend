const userModel = require('../models/userModel')

const createUser = async function(req, res){
    try {
        let data = req.body
        const userCreate = await userModel.create(data)
        return res.status(201).send({status: true, message: "user created successfully", data: userCreate})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {createUser}