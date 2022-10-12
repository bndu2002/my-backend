const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController')
const middleware = require('../middleware/auth')


router.post('/register', userController.createUser);

router.post('/login',userController.loginUser);

router.get('/user/:userId/profile',middleware.authentication,userController.getUser);

router.put('/user/:userId/profile',middleware.authentication,userController.updateuser);

//Product API's
router.post('/products',productController.createProduct);

router.get('/products/:productId',productController.getProduct)




router.all('/*', (req, res) => { return res.status(400).send({ status: false, message: "Endpoint Is Incorrect" }) })
module.exports = router;