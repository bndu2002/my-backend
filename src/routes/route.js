const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const commonMW = require("../middlewares/commonMiddlewares")
const productController = require("../controllers/productController")




router.post("/createUser", UserController.createUser)

router.post('/createProduct',productController.createProduct)

router.post('/createUser',commonMW.mid1, UserController.createUser)









module.exports = router;