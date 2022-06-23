const authorModel = require("../models/authorModel")

// const auth = require("../middleware/auth")
const jwt = require("jsonwebtoken")

// const validate = require("../validate/")



const mongoose = require('mongoose')


const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}


// const isValidBody = function(body) {
//     return Object.keys(body).length > 0
// }

// const isValidObjectId = function(ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }
const createAuthor = async function(req, res) {
    try {
        let author = req.body



        // destructure
        let { fName, lName, title, emailId, password } = author
        if (!isValid(fName)) {
            return res.status(400).send({ status: false, msg: "Please provide the correct fName" })
        }
        if (!isValid(lName)) {
            return res.status(400).send({ status: false, msg: "Please provide the correct lName" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide the correct title" })
        }

        if (!isValid(emailId)) {
            return res.status(400).send({ status: false, msg: "Please provide the correct email" })

        }
        if (!isValid(password)) {
            return res.status(400).send({
                status: false,
                msg: "Please provide the correct password"
            })
        }
        let authorCreated = await authorModel.create(author)
        res.status(201).send({ status: true, data: authorCreated })
    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.createAuthor = createAuthor;

//-------------------------------->    login author    <------------------------------------


const authorLogIn = async function(req, res) {
    try {
        let authorName = req.body.emailId;
        let password = req.body.password;

        if (!isValid(authorName))
            return res.status(400).send({ status: false, msg: "email must be present" })

        if (!isValid(password))
            return res.status(400).send({ status: false, msg: "email must be present" })


        let author = await authorModel.findOne({ emailId: authorName, password: password })

        if (!author) {
            return res.status(401).send({ status: false, msg: "Author doesn't exists" })
        }



        // Token creation
        let token = jwt.sign({ authorId: author._id.toString() }, "Project-one");
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, token: token })

    } catch (err) {
        res.status(500).send({ msg: "Error", err: err.message })
    }
};


module.exports.authorLogIn = authorLogIn