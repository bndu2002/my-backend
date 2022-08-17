const express = require('express');
const router = express.Router();
// const UserModel= require("../models/userModel.js")
const UserController= require("../controllers/userController")
const BookController= require("../controllers/bookController")
const AuthorController = require('../controllers/AuthorController')
const PustakController = require('../controllers/PustakController')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createUser", UserController.createUser  )

router.get("/getUsersData", UserController.getUsersData)

router.post("/createBook", BookController.createBook  )

router.get("/getBooksData", BookController.getBooksData)

router.post("/createAuthor",AuthorController.createAuthor)

router.get("/creatBook",PustakController.creatBook)

router.get("/getChetan",AuthorController.getChetan)

router.get("/twoStates",AuthorController.twoStates)

router.get("/bookFind",AuthorController.bookFind)

module.exports = router;