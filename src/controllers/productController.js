const productModel = require('../models/productModel')

const createProduct = async function(req,res){
   const product = req.body
   const saveProduct = await productModel.create(product)
   res.send({status : true , msg : saveProduct})

}

module.exports.createProduct = createProduct