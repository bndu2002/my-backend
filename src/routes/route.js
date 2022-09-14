const express = require('express');
const router = express.Router();
const authorController=require("../controllers/authorsController")
const blogController=require("../controllers/blogsController")
const middleWare=require("../Middleware/Middleware");



router.get("/test-me",function(req,res){
    res.status(200).send({msg:"All ok"})
})
//-------------------------------API for Create Author-----------------------//
router.post("/authors",authorController.createAuthor)


//-------------------------------API for  Author Login-----------------------//

router.post("/login",authorController.loginAuthor)

//-----------------------API for Create Blog-----------------------------//
router.post("/blogs",middleWare.authenticate,blogController.createBlog)

//---------------------API for Fetch Blog--------------------------//
router.get("/getblogs",middleWare.authenticate,blogController.getblog)

//---------------------API for Update  Blog------------------//
router.put("/blogs/:blogId",middleWare.authenticate, blogController.updateBlog)

//---------------API for Delete Blog---------------------//
router.delete("/blogs/:blogId", middleWare.authenticate, blogController.deleteBlog)
router.delete("/delete" , middleWare.authenticate , blogController.deleteBlogByQuery)





module.exports = router;   

