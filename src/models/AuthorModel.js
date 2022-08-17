const mongoose= require('mongoose')

const authorSchema = new mongoose.Schema ({
    c: {
        type : Number,
        required : true,
        unique : true
    },
    author_name : String,
    age : Number,
    address : String


 },{timestamps : true})

 

 module.exports = mongoose.model('Author',authorSchema)
