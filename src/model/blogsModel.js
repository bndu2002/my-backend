const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: objectId,
        required: true,
        ref: 'Author'
    },
    tags: [String],

    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: [String],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt : {
        type : Boolean
    },
    publishedAt: {
        type:Date
    },
    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema) 
