const { json } = require('body-parser')
const AuthorModel = require('../models/AuthorModel')
 const PustakModel = require('../models/PustakModel')

const createAuthor = async function(req,res){
    let newAuthor = req.body
    let saveAuthor = await AuthorModel.create(newAuthor)
    if(!author_id){
         return res.send({status : false , msg : "author id is not available"})
    }
    
    res.send({msg : saveAuthor})
}

const getChetan = async function(req,res){

    let Author = await AuthorModel.find({author_name : { $eq : "Chetan Bhagat"}}).select({author_id : 1 , _id : 0})
    let pustak = await PustakModel.find({$and : [{Author},{author_id : { $eq : 1}}]})

    res.send({msg : pustak})
}

const twoStates = async function(req,res){
    let findAuthor = await PustakModel.findOneAndUpdate(
        {pustakName : "2 states"},
        {$set : {price : 100}},
        {new : true}
    )
   
    let author = await AuthorModel.findOne({author_id :{$eq: findAuthor.author_id}}).select({author_name : 1})
    let authorprice = {author_name : author.author_name , price:findAuthor.price}

    res.send({msg : authorprice})

}

const bookFind = async function(req,res){
    let book = await PustakModel.find({price : { $gte : 50 , $lte : 100} })
   
    let final =  book.map( async function(elem)  {  AuthorModel.find({author_id : elem.author_id}).select({author_name : 1 , _id :0})})
   //let author = await AuthorModel.find().select({author_name : 1 , _id :0})
    //let le = author.map((elem) => {return  elem.author_id == book.author_id ? elem.author_name : "nikl"})
   //let de = { author_id : book.author_id , author_name : author.author_name}
    res.send("dummy response")
    console.log(final)
}
   
    

module.exports.createAuthor = createAuthor
module.exports.getChetan = getChetan
module.exports.twoStates = twoStates
module.exports.bookFind = bookFind

// Then next query will get the list of books with that author_id )
//run a map(or forEach) loop and get all the authorName corresponding to the authorId’s ( by querying authorModel)
