const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const createOrder = async function (req, res) {
  const orderData = req.body;
  const userId = req.body.userId;
  const productId = req.body.productId;
  const validUser = await userModel.findById(userId);
  const validProduct = await productModel.findById(productId);
  const appType = req.headers.isfreeappuser;

  if (userId) {
    if (validUser) {
      if (productId) {
        if (validProduct) {
          if (appType) {
            orderData.isFreeAppUser = true;
            orderData.amount = 0;
            const createOrder = await orderModel.create(orderData);
              return res.send({ msg: createOrder });
          } else {
            if (validUser.balance < validProduct.price) {
              res.send({ msg: "user does not have sufficient balance" });
            } else {
              console.log("reached");
              const updateUser = await userModel.findOneAndUpdate(
                { _id: orderData.userId },
                { balance: validUser.balance - validProduct.price },
                { new: true }
              );
              // res.send(updateUser)
              // console.log('reached',updateUser)
              orderData.amount = validProduct.price;
              orderData.isFreeAppUser = appType;
              const createOrder = await orderModel.create(orderData);
              return res.send({ msg: createOrder });
            }
            
          }
        } else {
          res.send("invalid product id");
        }
      } else {
        res.send("product id not available");
      }
    } else {
      res.send("invalid user id");
    }
  } else {
    return res.send("user is not available");
  }
};

// For paid user app and the user has sufficient balance. We deduct the balance from user's balance and update the user. We create an order document

module.exports.createOrder = createOrder;


