const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const createOrder = async function(req , res){
const orderData = req.body
const user = await userModel.findById(orderData.userId)
if(!user){
  return res.send({status : false , msg : "user id not available"})
}
const product = await productModel.findById(orderData.productId)
if(!product){
  return res.send({status : false , msg : "product id not available"})
}

if(req.headers.isfreeappuser == false ){
  user.isFreeAppUser = false
  if(user.balance >= product.price ){
    const updateUser = await userModel.findOneAndUpdate(
      {_id : orderData.userId },
      {balance : user.balance - product.price},
      {new : true}
    )
    orderData.isFreeAppUser = false
    orderData.amount =  product.price
  }
  if(user.balance < product.price){
    orderData.isFreeAppUser = false
    user.isFreeAppUser = false
   return res.send({status : false , msg: "user does not have sufficient balance"})
  }
 
}else{
  user.isFreeAppUser = true
orderData.isFreeAppUser = true
orderData.amount = 0
console.log(user.isFreeAppUser)
}
const createOrder = await orderModel.create(orderData)
res.send({status : true , msg : createOrder})
}




// For paid user app and the user has sufficient balance. We deduct the balance from user's balance and update the user. We create an order document

module.exports.createOrder = createOrder;


// if(user.balance < product.price){
//   orderData.isFreeAppUser = false
//   user.isFreeAppUser = false
//  return res.send({status : false , msg: "user does not have sufficient balance"})
// }
// // }else{ 
// user.isFreeAppUser = true
// orderData.isFreeAppUser = true
// orderData.amount = 0
// // }