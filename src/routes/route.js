const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController')


router.post('/register', userController.createUser);
router.get('/login',userController.loginUser);





router.all('/*', (req, res) => { return res.status(400).send({ status: false, message: "Endpoint Is Incorrect" }) })
module.exports = router;