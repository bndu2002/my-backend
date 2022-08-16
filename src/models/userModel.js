const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    firstName: String,
    lastName: String,
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    emailId: String,
    gender: {
        type: String,
        enum: ["male", "female", "LGBTQ"] //"falana" will give an error
    },
    age: Number,
    // isIndian: Boolean,
    // parentsInfo: {
    //     motherName: String,
    //     fatherName: String,
    //     siblingName: String
    // },
    // cars: [ String  ]
}, { timestamps: true });


const bookSchema = new mongoose.Schema({
    bookName : {   
        type : String,
        required : true,
        unique : true
    },
    authorName : {
        type : String,
        required : true
    },
    category : [String],
    PublishingYear : Number,

},{timestamps : true});

let newBookSchema = new mongoose.Schema({
  bookName : {
     type : String,
      required : true
    },
    tags : [String],
  authorName : String,
  totalpages : Number,
  prices : {
    indianPrice : String,
    usaPrice : String   
  },
  year : {
     type : String,
      default : 2021
    },
    stockAvailable : Boolean  
},{ timestamps : true})



module.exports = mongoose.model('User', userSchema) //users
module.exports = mongoose.model('Book',bookSchema)//books
module.exports = mongoose.model('NewBook',newBookSchema)



// String, Number
// Boolean, Object/json, array