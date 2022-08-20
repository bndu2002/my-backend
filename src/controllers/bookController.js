const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")

const createBook= async function (req, res) {
    let book = req.body
    let bookCreated = await bookModel.create(book)
    res.send({data: bookCreated})
}

const getBooksData= async function (req, res) {
    let books = await bookModel.find()
    res.send({data: books})
}

const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id')
    res.send({data: specificBook})

}

// The authorId is present in the request body. If absent send an error message that this detail is required
// If present, make sure the authorId is a valid ObjectId in the author collection. If not then send an error message that the author is not present.
// The publisherId is present in the request body. If absent send an error message that this detail is required
// If present, make sure the publisherId is a valid ObjectId in the publisher collection. If not then send an error message that the publisher is not present.


const createNewbook = async function (req,res){
   let newbook = req.body 
   let author = req.body.author
   let publisher = req.body.publisher
   let author1 = await authorModel.findById(author)
   let publisher1 = await publisherModel.findById(publisher)
 if(author){
    if(publisher){
        if(author1){
            if (publisher1){
                let create = await bookModel.create(newbook)
                res.send({msg : create})
            }else{ res.send({msg : "publisher did not match"})}
        }else{ res.send({ msg : "author does not match"})}
    }else { res.send({ msg : " publisher is mandatory"})}
 
}else{res.send({msg : "author is mandatory"})}
 
}

// Write a GET api that fetches all the books along with their author details (you have to populate for this) as well the publisher details (you have to populate for this) 

 
const getbookPublisherAuthor = async function(req,res){
    let getdetails = await bookModel.find().populate('author publisher')
    res.send({msg : getdetails})
}


// Create a new PUT api /books and perform the following two operations
//  a) Add a new boolean attribute in the book schema called isHardCover with a default false value. For the books published by 'Penguin' and 'HarperCollins', update this key to true.

const books = async function (req,res){
 
  let publisher1 = await publisherModel.find({ name : ["penguin" , "harper collins"] }).select({_id : 1})

  let updatedetails = await bookModel.updateMany(
    { publisher : publisher1},
    { $set : {isHardCover : true}},
    { new : true}
    
  )
       res.send({msg : updatedetails})
    }


    // b) For the books written by authors having a rating greater than 3.5, update the books price by 10 (For eg if old price for such a book is 50, new will be 60) 


    const updatePrice = async function(req,res){
        let author1 = await authorModel.find({rating : { $gt : 3.5}}).select({_id : 1})
        let edit = await bookModel.updateMany(
            {author : author1},
            {$inc : { price : 200}},
            {new : true}
        )
        res.send({msg : edit})
   
    }
module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
module.exports.createNewbook = createNewbook
module.exports.getbookPublisherAuthor = getbookPublisherAuthor 
module.exports.books = books
module.exports.updatePrice = updatePrice