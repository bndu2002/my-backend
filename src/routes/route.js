const express = require('express');
const router = express.Router();
const authorsController = require("../controllers/authorsController")
const blogsController = require("../controllers/blogsController")



router.get("/test-me",function(req,res){
    res.status(200).send({msg:"All ok"})
})


router.post("/authors",authorsController.createAuthor)
router.post("/blogs",blogsController.createBlog)
router.put("/blogs/:blogId",blogsController.updateBlog)
router.delete("/blogs",blogsController.deleteBlogByQuery)
router.post("/login",authorsController.loginAuthor)
// router.get("/getblogs",blogsController.getblog)


module.exports = router;   