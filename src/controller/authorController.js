// const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const { isValid } = require("../validator/validations")
const validator = require('validator')
const jwt = require("jsonwebtoken")
// **************regex password********/
let validpassword = /^[a-zA-Z0-9!@#$%^&*]{8,16}$/

//*******************************************API_CREATE AUTHOR **************************/

const createAuthor = async function (req, res) {
  try {
    let data = req.body
    let { fname, lname, title, email, password } = data
    // require mendatory 
    if (!isValid(fname)) return res.status(400).send({ status: false, message: "first-name is required" })

    if (!isValid(lname)) return res.status(400).send({ status: false, message: "last-name is required" })

    if (!isValid(title)) return res.status(400).send({ status: false, message: "title-Name is required" })
    if (title) {
      if (!(["Mr", "Mrs", "Miss"].includes(title))) {
        return res.status(400).send({ status: false, message: "please provied valid title" })
      }
    }

    if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

    if (!isValid(password)) return res.status(400).send({ status: false, message: "password is required" })
    if (!validpassword.test(password)) {
      return res.status(400).send({ status: false, message: "please enter valid alphanumeric password min character 8" })
    }

    let validFname = validator.isAlpha(fname);
    if (validFname == false)
      return res.status(400).send({ status: false, msg: "please enter valid fname", });

    let validLname = validator.isAlpha(lname);
    if (validLname == false)
      return res.status(400).send({ status: false, msg: "please enter valid lname" });

    if (!validator.isEmail(email.trim())) return res.status(400).send({ status: false, msg: "please enter valid email address!" })


    let checkEmail = await authorModel.findOne({ email: email })

    if (checkEmail) return res.status(400).send({ status: false, message: "email is already exist" })

    const resultData = await authorModel.create(data)
    return res.status(201).send({ status: true, data: resultData })

  } catch (error) {
    res.status(500).send({ staus: false, message: err.message })
  }
}

//*******************************************API_LOGIN **************************/

let loginAuthor = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!isValid(email)) {
      return res.status(400).send({ status: false, msg: " email is required" });
    }
    if (!isValid(password)) {
      return res.status(400).send({ status: false, msg: " password is required" });
    }

    if (!validator.isEmail(email.trim())) 
    return res.status(400).send({ status: false, msg: "You have to enter a valid email address!" });

    let validateAuthor = await authorModel.findOne({ email: email.trim(), password:password});
   
    if (validateAuthor.email != email) 
    return res.status(404).send({ status: false, msg: "userName is not correct" });

    if (validateAuthor.password != password)
      return res.status(401).send({ status: false, msg: "invalid password" });

    let key = jwt.sign(
      { id: validateAuthor._id }, "GAS-project-1-team-16", { expiresIn: '1h' });

    res.setHeader("x-api-key", key);
    res.status(200).send({ status: true, Token: key });

  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

module.exports = { loginAuthor, createAuthor }