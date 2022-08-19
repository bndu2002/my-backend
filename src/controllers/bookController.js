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
   //let publisher = req.body.publisher


  
//    if(!author){ 
//       res.send({status : false , msg : "author id is mandatory"})
//    }
//      if(author){
//      let isPresent = await bookModel.find({})
     
//      if (!isPresent){ 
//         res.send({msg : "not valid"})
//      }else{ let savebook = await bookModel.create(newbook)
//         res.send({msg : savebook}) }
    
//     }
    
   
// }
 
 
    //else if (author){
//       let 
//    }


//    else if(!publisher){
//     return res.send({status : false , msg : "publisher id is mandatory"})
//     }
  
//     let savebook = await bookModel.create(newbook)
//    res.send({msg : savebook})





module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
module.exports.createNewbook = createNewbook
