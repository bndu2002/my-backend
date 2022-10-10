const userModel = require('../models/userModel');
const { isValidMail, isValidName, isValidRequestBody, isPresent, isValidNumber, isvalidPassword } = require('../validator/validator')
const bcrypt = require("bcrypt")
const { uploadFile } = require('../controllers/awsController');
const { json } = require('express');



const createUser = async function (req, res) {
    try {
        let { fname, lname, email, phone, password, address } = req.body

        if (!isPresent(fname) || !isValidName.test(fname)) return res.status(400).send({ status: false, message: "fname is missing or invalid" })

        if (!isPresent(lname) || !isValidName.test(lname)) return res.status(400).send({ status: false, message: "lname is missing or invalid" })

        if (!isPresent(email) || !isValidMail.test(email)) {
            return res.status(400).send({ status: false, message: "email is missing or invalid" })
        } else {
            let repeatedEmail = await userModel.findOne({ email: email })
            if (repeatedEmail) return res.status(400).send({ status: false, message: "email is already in use" })
        }

        if (!isPresent(phone) || !isValidNumber.test(phone)) {
            return res.status(400).send({ status: false, message: "phone is missing or invalid" })
        } else {
            let repeatedPhone = await userModel.findOne({ phone: phone })
            if (repeatedPhone) return res.status(400).send({ status: false, message: "phone is already in use" })
        }

        let profileImage = req.files

        if (profileImage && profileImage.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(profileImage[0])
            //profileImage was available in req.files ; added new key in req.body.profileImage = uploadedFileURL
            req.body.profileImage = uploadedFileURL
            //res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else {
            return res.status(400).send({ msg: "No file found" })
        }

        if (!isPresent(password) || !isvalidPassword.test(password)) {
            return res.status(400).send({ status: false, message: "password is missing or invalid" })
        }

        //if (!isvalidPassword.test(password)) return res.status(400).send({ status: false, message: "enter a valid password" })

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        // if (isPresent(address)) {
        //     let { shipping, billing } = address
        //     if (!isPresent(shipping) || !isPresent(billing))
        //         return res.status(400).send({ status: false, message: "billing and shipping are required" })
        // }else{
        //     return  res.status(400).send({ status: false, message: "address required" })
        // }
        //let address1 = toJSON(address)

        if (isPresent(address)) {
           
        }

        let data = {
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,
            password: hashedPassword,
            profileImage: req.body.profileImage,
            address: address

        }
        //console.log(typeof(address))
        const createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "successsfully created", data: createUser })





    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createUser }