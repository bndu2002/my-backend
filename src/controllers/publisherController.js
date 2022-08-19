const PublisherModel= require("../models/publisherModel")

const createPublisher = async function(req,res){
   let publisher = req.body
   let savePublisher = await PublisherModel.create(publisher)
   res.send({msg : savePublisher })

}

module.exports.createPublisher = createPublisher