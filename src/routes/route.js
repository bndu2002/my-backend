const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const middleware = require('../middleware/auth')



router.post("/users" , userController.createUser)

router.post("/login",middleware.userVerification, userController.loginUser)

router.get("/users/:userId",middleware.tokenValidation,middleware.userAuthorisation, userController.getDetails)

router.put("/users/:userId",middleware.tokenValidation,middleware.userAuthorisation, userController.updateUser)

router.delete("/users/:userId",middleware.tokenValidation,middleware.userAuthorisation, userController.deleteUser)

module.exports = router;