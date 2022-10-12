const productModel = require('../models/productModel')
const { isValidName, isValidRequestBody, isPresent, isValidTitle } = require('../validator/validator')
const { uploadFile } = require('../controllers/awsController');



const createProduct = async function (req, res) {
    try {
        let { isDeleted, installments, availableSizes, style, isFreeShipping, currencyFormat, currencyId, price, description, title } = req.body

        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" });

        if (!isPresent(title) || !isValidTitle.test(title)) return res.status(400).send({ status: false, message: "Title is missing or invalid" });

        //regex for title : mandatory alaphabet??
        if (!isPresent(description) || !isValidTitle.test(description)) return res.status(400).send({ status: false, message: "description is missing or invalid" });

        if (!isPresent(price) || !(/^\d*\.?\d*$/).test(price)) return res.status(400).send({ status: false, message: "price is missing or invalid" })

        // if(currencyId !=  "INR"){
        //     return res.status(400).send({status:false , message : "Currency ID must be INR"})
        // }

        if (!isPresent(currencyId)) {
            req.body.currencyId = "INR"
        } else {
            if (!("INR").includes(currencyId))
                return res.status(400).send({ status: false, message: "Currency ID must be INR" })
        }

        if (!isPresent(currencyFormat)) {
            req.body.currencyFormat = "₹"
        } else {
            if (!("₹").includes(currencyFormat))
                return res.status(400).send({ status: false, message: "currencyFormat  must be ₹" })
        }

        let productImage = req.files

        if (productImage && productImage.length > 0) {
            let uploadedFileURL = await uploadFile(productImage[0])
            //profileImage was available in req.files ; added new key in req.body.profileImage = uploadedFileURL
            req.body.productImage = uploadedFileURL
        } else {
            return res.status(400).send({ msg: "No file found" })
        }

       // let joinsize = availableSizes.join(",")
         console.log(availableSizes)
        if (!isPresent(availableSizes) || !["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes)) {
           // console.log(joinsize)
            return res.status(400).send({ status: false, message: "availableSizes is missing or invalid : provide  S, XS, M, X, L, XXL, XL " })
        }

        
        
        
        
        if (installments == Number) {
            if (!/^\d+$/.test(installments))
                return res.status(400).send({ status: fasle, message: " installments must be a digit" })
        }

        if (isDeleted == true) return res.status(400).send({ status: false, message: "cannot delete while creation" })


        let productCreate = await productModel.create(req.body)

        return res.status(201).send({ status: true, message: "created successfull", data: productCreate })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createProduct }