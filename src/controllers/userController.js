const userModel = require('../models/userModel');
const { isValidMail, isValidName, isValidRequestBody, isPresent, isValidNumber, isvalidPassword } = require('../validator/validator')
const bcrypt = require("bcrypt")
const { uploadFile } = require('../controllers/awsController');
const { json } = require('express');
const jwt = require('jsonwebtoken')



const createUser = async function (req, res) {
    try {
        let { fname, lname, email, phone, password, address } = req.body

        if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "body cannot be empty" })

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
            let uploadedFileURL = await uploadFile(profileImage[0])
            //profileImage was available in req.files ; added new key in req.body.profileImage = uploadedFileURL
            req.body.profileImage = uploadedFileURL
        } else {
            return res.status(400).send({ msg: "No file found" })
        }

        if (!isPresent(password) || !isvalidPassword.test(password)) {
            return res.status(400).send({ status: false, message: "password is missing or invalid" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        let { shipping, billing } = address

        if (!shipping.street || !shipping.city || !shipping.pincode) return res.status(400).send({ status: false, message: "shipping - street,city,pincode ; are required" })

        if (!billing.street || !billing.city || !billing.pincode) return res.status(400).send({ status: false, message: "billing - street,city,pincode ; are required" })

        if (!(/^\d{3}\s?\d{3}$/.test(shipping.pincode)) || !(/^\d{3}\s?\d{3}$/.test(billing.pincode))) {
            return res.status(400).send({ status: false, message: "Enter A Valid Pincode" })
        }

        if (!isValidName.test(shipping.city) || !isValidName.test(billing.city)) {
            return res.status(400).send({ status: false, message: "Enter A Valid City" })
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

        const createUser = await userModel.create(data)

        return res.status(201).send({ status: true, message: "successsfully created", data: createUser })

    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

const loginUser = async function (req, res) {
    try {

        let email = req.body.email
        let password = req.body.password;

        if (!email || !password) return res.status(400).send({ status: false, message: "email and password are required" })


        let findUser = await userModel.findOne({ email: email })

        let checkPassword = await bcrypt.compare(password, findUser.password)

        if (!findUser || !checkPassword) return res.status(404).send({ status: false, message: "User not found" });


        let token = jwt.sign({
            id: findUser._id.toString(),
            iat: Math.floor(new Date().getTime() / 1000)
        },
            "Product5-group59", { expiresIn: "1h" });

        res.setHeader("Authorization", "Bearer " + token);

        let data = {
            userId: findUser._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "User login successfully", data: data });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}





module.exports = { createUser, loginUser }