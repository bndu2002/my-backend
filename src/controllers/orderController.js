const orderModel = require('../models/orderModel')
const userModel = require("../models/userModel")
const productModel = require('../models/productModel')


const createOrder = async function(req,res){
  const userId = req.body.userId
  const productId = req.body.productId
  const validUser = await userModel.findById(userId)
  const validProduct = await productModel.findById(productId)

  if(userId){
    if(validUser){
        if(productId){
            if(validProduct){
             
                    // if(isAppFree == false && userbalance >= productPrice ){

                    // }
                    
                     const Order = req.body
                     const placeOrder = await orderModel.create(Order)
                    res.send({msg : placeOrder})

                 } else{res.send("invalid product id")}
        }else{ res.send("product id not available")}
    }else{res.send("invalid user id")}
  }else{ return res.send("user is not available")}

  const userbalance = await userModel.find().select({balance : 1 , _id : 0})
  const productPrice = await productModel.find().select({price : 1 , _id : 0})
  console.log(userbalance)
                    console.log(productPrice)
}

// For paid user app and the user has sufficient balance. We deduct the balance from user's balance and update the user. We create an order document

module.exports.createOrder = createOrder


// const Order = req.body
                //  const userbalance = await userModel.find().select({balance : 1 , _id : 0})
                //  const productPrice = await productModel.find().select({price : 1 , _id : 0})
                 //const placeOrder = await orderModel.create(Order)
               
                //  if(req.isUserAppFree === 'false' && userbalance >= productPrice){
                //     let updateUser = await userModel.updateOne(
                //       {userbalance :{$lt : productPrice} },
                //       {$inc :{userbalance : - productPrice } },
                //       { new : true}
                     
                //     )