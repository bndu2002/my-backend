const productModel = require('../models/productModel')
const { isValidObjectId, isValidName, isValidRequestBody, isPresent, isValidTitle } = require('../validator/validator')
const { uploadFile } = require('../controllers/awsController');



const createProduct = async function (req, res) {
    try {
        let { isDeleted, installments, availableSizes, style, isFreeShipping, currencyFormat, currencyId, price, description, title } = req.body

        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" });

        if (!isPresent(title) || !isValidTitle.test(title)) return res.status(400).send({ status: false, message: "Title is missing or invalid" });

        //regex for title : mandatory alaphabet??
        if (!isPresent(description) || !isValidTitle.test(description)) {
            return res.status(400).send({ status: false, message: "description is missing or invalid" })
        } else {
            let repeatedTitle = await productModel.findOne({ title: title })
            if (repeatedTitle)
                return res.status(409).send({ status: false, message: "title has to be unique" })
        }

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
        //console.log(availableSizes)

        // availableSizes = availableSizes.split(",")
        // if (!isPresent(availableSizes) || !["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes)) {
        //    // console.log(joinsize)
        //     return res.status(400).send({ status: false, message: "availableSizes is missing or invalid : provide  S, XS, M, X, L, XXL, XL " })
        // }

        console.log(availableSizes)

        availableSizes = availableSizes.split(",")
        if (!isPresent(availableSizes)) return res.send("End")
        for (let i = 0; i < availableSizes.length; i++) {
            if (!(["S", "XS", "M", "X", "L", "XXL", "XL"].includes(availableSizes[i])))
                return res.status(400).send({ status: false, message: "availableSizes is missing or invalid : provide  S, XS, M, X, L, XXL, XL " })
        }

        req.body.availableSizes = availableSizes

        if (installments == Number) {
            if (!/^\d+$/.test(installments))
                return res.status(400).send({ status: fasle, message: " installments must be a digit" })
        }

        if (isDeleted == true) return res.status(400).send({ status: false, message: "cannot delete while creation" })

        // let data = {
        //     title: fname,
        //     pr: lname,
        //     email: email,
        //     phone: phone,
        //     password: hashedPassword,
        //     profileImage: req.body.profileImage,
        //     address: address

        // }

        let productCreate = await productModel.create(req.body)

        return res.status(201).send({ status: true, message: "created successfull", data: productCreate })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getProduct = async function (req, res) {
    try {
        let productId = req.params.productId

        if (!productId) return res.status(400).send({ status: false, message: "provide product id in params" })
        //this msg will never get printed 106

        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "product id is not valid" })

        let checkProduct = await productModel.findById(productId)

        if (!checkProduct) return res.status(404).send({ status: false, message: "product not found" })

        return res.status(200).send({ status: true, message: "products", data: checkProduct })
   
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createProduct, getProduct }