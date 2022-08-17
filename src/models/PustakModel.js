const mongoose= require('mongoose')

const pustakSchema = new mongoose.Schema({
    pustakName : String,
    author_id : {
        type : Number,
        required : true
    },
    price : Number,
    ratings : String
 },{timestamps : true})

 module.exports = mongoose.model('pustak',pustakSchema)