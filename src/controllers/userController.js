const userModel = require('../models/userModel');
const { isValidPincode, isValidMail, isValidName, isValidRequestBody, isPresent, isValidNumber, isValidPassword } = require('../validator/validator')
const bcrypt = require("bcrypt")
const { uploadFile } = require('../controllers/awsController');

const jwt = require('jsonwebtoken');
let mongoose = require('mongoose');




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

        // let { shipping, billing } = address
        // if (!shipping) return res.status(400).send({ status: false, message: "shipping - street,city,pincode ; are required" })
        // if (!billing.street || !billing.city || !billing.pincode) return res.status(400).send({ status: false, message: "billing - street,city,pincode ; are required" })

        if (!address) {
            return res.status(400).send({ status: false, message: "address is required" })
        }

        let { shipping, billing } = address

        if (!shipping) {
            return res.status(400).send({ status: false, message: "shipping is required" })
        }

        if (!shipping.street || !shipping.city || !shipping.pincode) return res.status(400).send({ status: false, message: "shipping - street,city,pincode ; are required" })

        if (!billing) {
            return res.status(400).send({ status: false, message: "billing is required" })
        }

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

        if (!findUser) return res.status(404).send({ status: false, message: "User not found" })

        let checkPassword = await bcrypt.compare(password, findUser.password)

        if (!checkPassword) return res.status(404).send({ status: false, message: "Incorrect Password" })
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
    try {
        let userId = req.params.userId
        //let body = req.body
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "UserId Is Invalid" })

        const fetchUser = await userModel.findById({ _id: userId })

        if (!fetchUser) return res.status(404).send({ status: false, message: "User Not Found" })

        //Authorization Check
        if (fetchUser._id != req.token.userId) return res.status(403).send({ status: false, msg: "Unauthorized User" })

        let { fname, lname, email, phone, password, address } = req.body

        let profileImage = req.files

        if (!isValidRequestBody(req.body) && !isPresent(profileImage)) return res.status(400).send({ status: false, message: "body cannot be empty" })

        if (Object.values(req.body).includes(fname)) {
            if (!isValidName.test(fname) || !isPresent(fname)) return res.status(400).send({ status: false, message: "Enter A Valid Fname" })
        }

        if (Object.values(req.body).includes(lname)) {
            if (!isValidName.test(lname) || !isPresent(lname)) return res.status(400).send({ status: false, message: "Enter A Valid Lname" })
        }

        if (Object.values(req.body).includes(email)) {
            if (!isValidMail.test(email) || !isPresent(email)) return res.status(400).send({ status: false, message: "Enter A Valid Email" })
            let repeatedEmail = await userModel.findOne({ email: email })
            if (repeatedEmail) return res.status(400).send({ status: false, message: `${email} Already In Use` })
        }

        if (Object.values(req.body).includes(phone)) {
            if (!isValidNumber.test(phone) || !isPresent(phone)) return res.status(400).send({ status: false, message: "Enter A Valid Phone Number" })
            let repeatedPhone = await userModel.findOne({ phone: phone })
            if (repeatedPhone) return res.status(400).send({ status: false, message: `${phone} Already In Use` })
        }

        if (Object.values(req.body).includes(password)) {
            if (!isValidPassword.test(password) || !isPresent(password)) return res.status(400).send({ status: false, message: "Enter A Valid Password" })
            const salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(password, salt)
            req.body["password"] = hashedPassword
        }

        console.log(profileImage)
        //if empty : take profileImage from DB
        if (profileImage) {
            if (profileImage.length > 0) {
                let uploadedFileURL = await uploadFile(profileImage[0])
                req.body.profileImage = uploadedFileURL
            }
            if (!profileImage.length) {
                req.body["profileImage"] = fetchUser.profileImage
            }

        }

        let updateAddress = {}
        //console.log(address)

        // if (address) {
        //     let { shipping, billing } = address
        //     if (shipping) {
        //         if (shipping.city) {
        //             if (!isValidName.test(shipping.city))
        //                 return res.status(400).send({ status: false, message: "Enter A Valid City" })
        //             updateAddress['shipping.city'] = address.shipping.city
        //         }
        //         if (shipping.pincode && !isValidPincode.test(shipping.pincode))
        //             return res.status(400).send({ status: false, message: "Enter A Valid Pincode" })
        //         updateAddress['shipping.pincode'] = address.shipping.pincode

        //     }
        //     console.log("here", address)
        //     if (billing) {
        //         if (billing.city && !isValidName.test(billing.city))
        //             return res.status(400).send({ status: false, message: "Enter A Valid City" })
        //         updateAddress['billing.city'] = address.billing.city
        //         if (billing.pincode && !isValidPincode.test(billing.pincode))
        //             return res.status(400).send({ status: false, message: "Enter A Valid Pincode" })
        //         updateAddress['billing.pincode'] = address.billing.pincode
        //     }

        // }
        //req.body.address = updateAddress
        //console.log(updateAddress)

        //updateAddress['address'] = fetchUser.address

        // if (address) {
        //     if (address.shipping) {
        //         if (address.shipping.street) {
        //             if (!isPresent(address.shipping.street)) {
        //                 return res.status(400).send({ status: false, message: 'Please provide street to update' })
        //             }
        //             updateAddress['address.shipping.street'] = address.shipping.street
        //         }
        //         if (address.shipping.city) {
        //             if (!isPresent(address.shipping.city)) {
        //                 return res.status(400).send({ status: false, message: 'Please provide city name to update' })
        //             }
        //             updateAddress['address.shipping.city'] = address.shipping.city
        //         }
        //         if (address.shipping.pincode) {
        //             // if (typeof address.shipping.pincode !== 'number') {
        //             //     return res.status(400).send({ status: false, message: 'Please provide pincode to update' })
        //             // }
        //             updateAddress['address.shipping.pincode'] = address.shipping.pincode
        //         }
        //     }
        //     if (address.billing) {
        //         if (address.billing.street) {
        //             if (!isPresent(address.billing.street)) {
        //                 return res.status(400).send({ status: false, message: 'Please provide street to update' })
        //             }
        //             updateAddress['address.billing.street'] = address.billing.street
        //         }
        //         if (address.billing.city) {
        //             if (!isPresent(address.billing.city)) {
        //                 return res.status(400).send({ status: false, message: 'Please provide city to update' })
        //             }
        //             updateAddress['address.billing.city'] = address.billing.city
        //         }
        //         if (address.billing.pincode) {
        //             if (typeof address.billing.pincode !== 'number') {
        //                 return res.status(400).send({ status: false, message: 'Please provide pincode to update' })
        //             }
        //             updateAddress['address.billing.pincode'] = address.billing.pincode
        //         }
        //     }
        // }

        // let data = {
        //     fname: fname,
        //     lname: lname,
        //     email: email,
        //     phone: phone,
        //     password: hashedPassword,
        //     profileImage: req.body.profileImage,
        //     address: updateAddress

        // }

        //console.log(data)
        //address = updateAddress



        //updateAddress = { address: fetchUser.address }

        if (address) {
            let { shipping, billing } = address

        }


        console.log("from here==>", updateAddress)
        req.body["address"] = updateAddress


        console.log(req.body.address)
        let updateduser = await userModel.findOneAndUpdate(
            { _id: userId },
            req.body,
            { new: true }

        )
        console.log("dekh", address)
        return res.send({ status: true, message: "updated user successfully", data: updateduser })
    }


    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

// const updateuser = async function (req, res) {
//     try {
//         const requestBody = req.body
//         let userId = req.params.userId
//         // if (!validObject(userId)) {
//         //     res.status(400).send({ status: false, message: `${userId} is invalid` })
//         //     return
//         // }
//         const userFound = await userModel.findOne({ _id: userId })
//         if (!userFound) {
//             return res.status(404).send({ status: false, message: `User do not exists` })
//         }
//         //Authorisation
//         if (userId.toString() !== req.token.userId) {
//             res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
//             return
//         }
//         if (!isValidRequestBody(requestBody)) {
//             res.status(400).send({ status: false, message: 'Please provide details to update' })
//             return
//         }
//         // destructuring the body
//         let { fname, lname, email, phone, password, address } = requestBody;
//         let updateUserData = {}
//         if (isPresent(fname)) {
//             updateUserData['fname'] = fname
//         }
//         if (isPresent(lname)) {
//             updateUserData['lname'] = lname
//         }
//         if (isPresent(email)) {
//             if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
//                 res.status(400).send({ status: false, message: `Email should be a valid email address` })
//             }
//             const duplicateEmail = await userModel.find({ email: email })
//             if (duplicateEmail.length) {
//                 res.status(400).send({ status: false, message: 'email already exists' })
//             }
//             updateUserData['email'] = email
//         }
//         if (isPresent(phone)) {
//             if (!(/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(phone.trim()))) {
//                 res.status(400).send({ status: false, message: `Please provide valid phone number` })
//             }
//             const duplicatePhone = await userModel.find({ phone: phone })
//             if (duplicatePhone.length) {
//                 res.status(400).send({ status: false, message: 'phone already exists' })
//             }
//             updateUserData['phone'] = phone
//         }
//         if (isValid(password)) {
//             console.log("hlooo")
//             const encrypt = await bcrypt.hash(password, 10)
//             updateUserData['password'] = encrypt
//         }
//         if (address) {
//             if (address.shipping) {
//                 if (address.shipping.street) {
//                     if (!isPresent(address.shipping.street)) {
//                         return res.status(400).send({ status: false, message: 'Please provide street to update' })
//                     }
//                     updateUserData['address.shipping.street'] = address.shipping.street
//                 }
//                 if (address.shipping.city) {
//                     if (!isPresent(address.shipping.city)) {
//                         return res.status(400).send({ status: false, message: 'Please provide city name to update' })
//                     }
//                     updateUserData['address.shipping.city'] = address.shipping.city
//                 }
//                 if (address.shipping.pincode) {
//                     if (typeof address.shipping.pincode !== 'number') {
//                         return res.status(400).send({ status: false, message: 'Please provide pincode to update' })
//                     }
//                     updateUserData['address.shipping.pincode'] = address.shipping.pincode
//                 }
//             }
//             if (address.billing) {
//                 if (address.billing.street) {
//                     if (!isPresent(address.billing.street)) {
//                         return res.status(400).send({ status: false, message: 'Please provide street to update' })
//                     }
//                     updateUserData['address.billing.street'] = address.billing.street
//                 }
//                 if (address.billing.city) {
//                     if (!isPresent(address.billing.city)) {
//                         return res.status(400).send({ status: false, message: 'Please provide city to update' })
//                     }
//                     updateUserData['address.billing.city'] = address.billing.city
//                 }
//                 if (address.billing.pincode) {
//                     if (typeof address.billing.pincode !== 'number') {
//                         return res.status(400).send({ status: false, message: 'Please provide pincode to update' })
//                     }
//                     updateUserData['address.billing.pincode'] = address.billing.pincode
//                 }
//             }
//         }
//         // aws.config.update({
//         //     accessKeyId: "AKIAY3L35MCRRMC6253G",  // id
//         //     secretAccessKey: "88NOFLHQrap/1G2LqUy9YkFbFRe/GNERsCyKvTZA",  // like your secret password
//         //     region: "ap-south-1" // Mumbai region
//         // });
//         // // this function uploads file to AWS and gives back the url for the file
//         // let uploadFile = async (file) => {
//         //     return new Promise(function (resolve, reject) { // exactly 
//         //         // Create S3 service object
//         //         let s3 = new aws.S3({ apiVersion: "2006-03-01" });
//         //         var uploadParams = {
//         //             ACL: "public-read", // this file is publically readable
//         //             Bucket: "classroom-training-bucket", // HERE
//         //             Key: "pk_newFolder/profileimages" + file.originalname, // HERE    "pk_newFolder/harry-potter.png" pk_newFolder/harry-potter.png
//         //             Body: file.buffer,
//         //         };
//         //         // Callback - function provided as the second parameter ( most oftenly)
//         //         s3.upload(uploadParams, function (err, data) {
//         //             if (err) {
//         //                 return reject({ "error": err });
//         //             }
//         //             console.log(data)
//         //             console.log(`File uploaded successfully. ${data.Location}`);
//         //             return resolve(data.Location); //HERE 
//         //         });
//         //     });
//         // };
//         let profileImage = req.files;
//         if (profileImage && profileImage.length > 0) {
//             let uploadedFileURL = await uploadFile(profileImage[0]);
//             if (uploadedFileURL) {
//                 updateUserData['profileImage'] = uploadedFileURL
//             }
//         }
//         const updatedUserData = await userModel.findOneAndUpdate({ _id: userId }, updateUserData, { new: true })
//         return res.status(201).send({ status: true, data: updatedUserData })
//     } catch (error) {
//         return res.status(500).send({ status: false, msg: error.message });
//     }
// }

module.exports = { createUser, loginUser, getUser, updateuser }