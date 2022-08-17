const { json } = require('body-parser')
const AuthorModel = require('../models/AuthorModel')
 const PustakModel = require('../models/PustakModel')

const createAuthor = async function(req,res){
    let newAuthor = req.body
    let saveAuthor = await AuthorModel.create(newAuthor)
    res.send({msg : saveAuthor})
}

const getChetan = async function(req,res){

    let Author = await AuthorModel.find({author_name : { $eq : "Chetan Bhagat"}}).select({author_id : 1 , _id : 0})
    let pustak = await PustakModel.find({$and : [{Author},{author_id : { $eq : 1}}]})
    // let pustak = await PustakModel.find({Author})
    res.send({msg : pustak})
}

const twoStates = async function(req,res){
    let findAuthor = await PustakModel.findOneAndUpdate(
        {pustakName : "2 states"},
        {$set : {price : 100}},
        {new : true}
    ).select({author_id : 1 , price : 1 , pustakName : 1 , _id : 0})

   
    let sendAuthor = await AuthorModel.find(findAuthor)

    res.send({msg :sendAuthor})

}

const bookFind = async function(req,res){
    let book = await PustakModel.find({price : { $gte : 50 , $lte : 100} })//.select({})
    res.send(book)
    let author = await 
}

module.exports.createAuthor = createAuthor
module.exports.getChetan = getChetan
module.exports.twoStates = twoStates
module.exports.bookFind = bookFind

// Then next query will get the list of books with that author_id )
