const AuthorModel= require("../models/authorModel")

const createAuthor= async function (req, res) {
    let author = req.body
    let authorCreated = await AuthorModel.create(author)
    res.send({data: authorCreated})
}

const getAuthorsData= async function (req, res) {
    let authors = await AuthorModel.find()
    res.send({data: authors})
}

const createNewAuthor = async function(req,res){
    let author = req.body
    let NewAuthor = await AuthorModel.create(author)
    res.send({msg : NewAuthor})
}

module.exports.createAuthor= createAuthor
module.exports.getAuthorsData= getAuthorsData
module.exports.createNewAuthor= createNewAuthor