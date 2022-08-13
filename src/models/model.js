let mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    mobile : {
        type : String,
        required : true,
        unique : true,
    },
    emailId : String,
    gendre : {
        type : String,
        enum : ["male","female","LGBTQ"]
    },
    age : Number,
},{timestamps : true})

module.exports = mongoose.model('User', userSchema)