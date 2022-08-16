const UserModel= require("../models/userModel")

const createUser= async function (req, res) {
    let data= req.body
    let savedData= await UserModel.create(data)
    res.send({msg: savedData})
}

const getUsersData= async function (req, res) {
    let allUsers= await UserModel.find()
    res.send({msg: allUsers})
}

const createBook = async function(req,res){
    let bookData = req.body
    let saveBook = await UserModel.create(bookData)
    res.send({msg : saveBook})
}




const getBooks = async function(req,res){
    let bookList = await UserModel.find()
    res.send({msg : bookList})
}

const newBookSchema = async function (req,res){
     let NewBook = req.body
     let saveBook = await UserModel.create(NewBook)
     res.send({ msg : saveBook})
}

const getNewbooks =  async function (req,res){
    
    let getbook = await UserModel.find()
    res.send({ msg : getbook})
}

const bookList = async function (req,res){
    
    let getbook = await UserModel.find().select({authorName : 1 , bookName : 1 , _id : 0})
    res.send({ msg : getbook})
}

const getBooksInYear = async function (req,res){
    let input = req.query.year
    let getbook = await UserModel.find({year : {$eq : input}})
    res.send({ msg : getbook})
}

const getParticularBooks = async function (req,res){
    let authorName = req.query.authorName
    let bookName = req.query.bookName
    let year = req.query.year

    let getbook = await UserModel.find({authorName : {$eq :authorName }})
    res.send(getbook)
    
}

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData
module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.newBookSchema = newBookSchema
module.exports.getNewbooks = getNewbooks
module.exports.bookList = bookList
module.exports.getBooksInYear = getBooksInYear
module.exports.getParticularBooks = getParticularBooks