const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema( {
   
	name: String,
	author:{
            type : ObjectId,
            ref : 'NewAuhtor'
        },
	price: Number,
		ratings: String,
	publisher: {
            type :  ObjectId,
            ref : 'Publisher'
        }

}, { timestamps: true });


module.exports = mongoose.model('LibraryBook', bookSchema)
