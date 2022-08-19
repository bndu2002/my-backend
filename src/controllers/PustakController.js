const PustakModel = require('../models/PustakModel')

const creatBook = async function(req,res){

    let newBook = req.body
    let saveBook = await PustakModel.create(newBook )
    if(!author_id){
        return res.send({status : false , msg : "author id is not available"})
    }
    res.send({msg :saveBook })
}

module.exports.creatBook = creatBook