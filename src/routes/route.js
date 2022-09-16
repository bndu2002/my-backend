const express= require('express')
const router = express.Router();
const CollegeController= require("../controllers/collegeController")
const InternController= require("../controllers/internController")

router.post("/functionup/colleges",CollegeController.createCollege)

router.post("/functionup/interns",InternController.createIntern)

router.get("/functionup/collegeDetails",CollegeController.getCollegDetails)

//validation for correct endpoint or request url
router.all("/*", (req,res)=>{return res.status(400).send({status:false,message:"Invalid Endpont"})})





module.exports=router;