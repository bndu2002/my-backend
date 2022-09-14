const express= require('express')
const router = express.Router();
const CollegeController= require("../controllers/collegeController")
const InternController= require("../controllers/internController")

router.post("/functionup/colleges",CollegeController.createCollege)





module.exports=router;