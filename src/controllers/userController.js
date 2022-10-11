const userModel = require('../models/userModel');
const { isValidPincode, isValidMail, isValidName, isValidRequestBody, isPresent, isValidNumber, isValidPassword } = require('../validator/validator')
const bcrypt = require("bcrypt")
const { uploadFile } = require('../controllers/awsController');
const { json } = require('express');
const jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
let formData = require('form-data')



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

        if (!isPresent(password) || !isValidPassword.test(password)) {
            return res.status(400).send({ status: false, message: "password is missing or invalid" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        let { shipping, billing } = address

        if (!shipping.street || !shipping.city || !shipping.pincode) return res.status(400).send({ status: false, message: "shipping - street,city,pincode ; are required" })

        if (!billing.street || !billing.city || !billing.pincode) return res.status(400).send({ status: false, message: "billing - street,city,pincode ; are required" })

        if (!isValidPincode.test(shipping.pincode) || !isValidPincode.test(billing.pincode)) {
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
     
        if (!email || !password) return res.status(400).send({ status: false, message: "Email and Password are required" })
        
        let findUser = await userModel.findOne({ email: email })
        
        if(!findUser)return res.status(404).send({ status: false, message: "User not found" })
        
        let checkPassword = await bcrypt.compare(password, findUser.password)
        
        if(!checkPassword)return res.status(404).send({ status: false, message: "Incorrect Password" })
        //if (!findUser || !checkPassword) return res.status(404).send({ status: false, message: "User not found" });

        let token = jwt.sign(
            {
                userId: findUser._id.toString(),
                iat: Math.floor(new Date().getTime() / 1000)
            },
            "Product5-group59",
            { expiresIn: "1h" });

        let data = {
            userId: findUser._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "Login Successfull", data: data });

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}


const getUser = async function (req, res) {
    try {
        let userId = req.params.userId

        // if (!data) {
        //     return res.status(400).send({ status: false, message: "provide something in params" })
        // }//this msg will never get printed

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "UserId Is Invalid" })

        const fetchUser = await userModel.findById({ _id: userId })

        if (!fetchUser) return res.status(404).send({ status: false, message: "User Not Found" })

        if (fetchUser._id != req.token.userId) return res.status(403).send({ status: false, msg: "Unauthorized User" })

        return res.status(200).send({ status: true, message: "User Profile Details", data: fetchUser })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateuser = async (req, res) => {
    let userId = req.params.userId

    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "UserId Is Invalid" })

    const fetchUser = await userModel.findById({ _id: userId })

    if (!fetchUser) return res.status(404).send({ status: false, message: "User Not Found" })

    //Authorization Check
    if (fetchUser._id != req.token.userId) return res.status(403).send({ status: false, msg: "Unauthorized User" })

    let { fname, lname, email, phone, password, address } = req.body
     
    let profileImage = req.files
    console.log("yha se" ,profileImage)
    if (!isValidRequestBody(req.body) && !isPresent(profileImage)) return res.status(400).send({ status: false, message: "body cannot be empty" })

    if (isPresent(fname)){
        if (!isValidName.test(fname))
            return res.status(400).send({ status: false, message: "Enter A Valid Fname" })
    }

    if (lname) {
        if (!isValidName.test(lname))
            return res.status(400).send({ status: false, message: "Enter A Valid Lname" })
    }

    if (email) {
        if (!isValidMail.test(email))
            return res.status(400).send({ status: false, message: "Enter A Valid Email" })
        let repeatedEmail = await userModel.findOne({ email: email })
        if (repeatedEmail) return res.status(400).send({ status: false, message: `${email} Already In Use` })
    }
    console.log("hiii")

    if (phone){
        
        console.log("truuu")
        if (!isValidNumber.test(phone))
            return res.status(400).send({ status: false, message: "Enter A Valid Phone Number" })
        let repeatedPhone = await userModel.findOne({ phone: phone })
        if (repeatedPhone) return res.status(400).send({ status: false, message: `${phone} Already In Use` })
    }

    console.log("hlooo")
    let hashedPassword;

    if(isPresent(password)){
        console.log("dekh")
        if (!isValidPassword.test(password))
            return res.status(400).send({ status: false, message: "Enter A Valid Password" })
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt)
        //password = hashedPassword
    }


      

    if (isPresent(profileImage)) {
        console.log("210" , profileImage)
        if (!profileImage.length > 0)
            return res.status(400).send({ status: false, message: "No File Found" })
        let uploadedFileURL = await uploadFile(profileImage[0])
        req.body.profileImage = uploadedFileURL
    }
    
    //let { shipping, billing } = address

    if (address) {
        let { shipping, billing } = address
        if (shipping) {
            if (shipping.city && !isValidName.test(shipping.city))
                return res.status(400).send({ status: false, message: "Enter A Valid City" })
            if (shipping.pincode && !isValidPincode.test(shipping.pincode))
                return res.status(400).send({ status: false, message: "Enter A Valid Pincode" })
        }

        if (billing) {
            if (billing.city && !isValidName.test(billing.city))
                return res.status(400).send({ status: false, message: "Enter A Valid City" })
            if (billing.pincode && !isValidPincode.test(billing.pincode))
                return res.status(400).send({ status: false, message: "Enter A Valid Pincode" })
        }
    }
    //let formData = new FormData();
    let data = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        password: hashedPassword,
        profileImage: req.body.profileImage,
        address: address

    }

    let updateuser = await userModel.findOneAndUpdate(
        { _id: userId },
        data,
        { new: true }

    )

    return res.send({ status: true, message: "updated user successfully", data: updateuser })

}

module.exports = { createUser, loginUser, getUser, updateuser }