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

module.exports.createUser= createUser
module.exports.getUsersData= getUsersData
module.exports.createBook = createBook
module.exports.getBooks = getBooks
