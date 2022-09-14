const jwt = require("jsonwebtoken");
const authorModel = require("../model/authorsModel")
const {isValidMail,isValid,isValidName,isValidRequestBody,isValidPassword} = require("../validator/validator");
      //imported all func & variable at once using destructuring
      //no need to write veriable.function or var


const createAuthor = async function (req, res) {
  try {
    let data = req.body;
    // validation for empty for body.
    if (!isValidRequestBody(data))return res.status(400).send({ status: false, message: "Plz enter some data." });

    // validation for empty string.
    if (!isValid(data.fname))return res.status(400).send({ status: false, msg: "fname is  requred" });

    //.test() method tests for a match in a string ,if finds returns true else false (ES1)
    //checking for valid regex of fname
    if (!isValidName.test(data.fname))return res.status(400).send({ status: false, msg: "Enter a valid first name" });

    //validation for valid string.
    if (!isValid(data.lname))return res.status(400).send({ status: false, msg: "lname is requred" });

    //checking for valid regex of lname
    if (!isValidName.test(data.lname))return res.status(400).send({ status: false, msg: "Enter a valid last name" });

    // validation for email id
    if (!isValid(data.email))return res.status(400).send({ status: false, msg: "mail id is required" });

    // validation for unique id.
    let uniqueEmail = await authorModel.findOne({ email: data.email });
    if (uniqueEmail){return res.status(400).send({ status: false, msg: "Email Already Exists." });}

    // validation for valid regex of email id
    if (!isValidMail.test(data.email))return res.status(400).send({ status: false, msg: "Invalid email id" });

    //.includes() method return true if a string contains specified string else false , it is case sensitive
    // validation for title
    if (!isValid(data.title))return res.send({ status: false, msg: "Title is required" });

    if (!data.title.includes("Mr", "Mrs", "Miss"))return res.status(400).send({ status: false, msg: "Enter a valid title " });

    // validation for password (presend & valid through regex)
    if (!isValid(data.password))return res.status(400).send({ status: false, msg: "password is required" });
    if(!isValidPassword.test(data.password))return res.status(400).send({status:false , msg: "enter a valid password"})
    
    
    let savedData = await authorModel.create(data);
    res.status(201).send({status: true,message: "Author profile is created successfully.",data: savedData,});

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

//-------------Login-------------------------------------------------//
const loginAuthor = async function (req, res) {
  try {
   
    //extracted keys in body
    let { email , password} = req.body
    
    if (!isValidRequestBody(req.body))return res.status(400).send({status: false,message: "request body can't be empty enter some data.",});
    
    if (!isValidMail.test(email))return res.status(400).send({ status: false, msg: "email required" });

    if (!isValid(password))return res.status(400).send({ status: false, msg: "password is required" });

    let verifyAuthor = await authorModel.findOne({email: email,password: password,});
   
    if (!verifyAuthor){return res.status(400).send({ status: false, msg: "email or password is incorrect" });}

    let token = jwt.sign(
      {
        authorId: verifyAuthor._id.toString(),
        project: 1,
        group: 56,
        batch: "Plutonium",
      },
      "thou-hath-the-poer"
    );
   
    res.setHeader("x-api-key", token);
    
    res.status(200).send({ status: true, msg: "logged in successfully", token: token });
  
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.loginAuthor = loginAuthor;
module.exports.createAuthor = createAuthor;
