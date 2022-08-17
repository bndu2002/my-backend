const PustakModel = require('../models/PustakModel')

const creatBook = async function(req,res){

    let newBook = req.body
    let saveBook = await PustakModel.create(newBook )
    res.send({msg :saveBook })
}

module.exports.creatBook = creatBook