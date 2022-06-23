const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");


// ------------------------// authentication  ==   certificate----------------->
const authentication = async function(req, res, next) {

    try {
        let token = (req.headers["x-api-key"]);
        let authorId = req.params



        // if (!token) token = req.headers["x-api-key"];
        //If no token is present in the request header return error
        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present" })
        }


        // If a token is present then decode the token with verify function
        let decodeToken = jwt.verify(token, "Project-one");

        if (!decodeToken) {
            return res.status(400).send({ status: false, msg: "Token is invalid" })
        }


        let authorLoggedIn = decodeToken.authorId; //userId for the logged-in user
        req["authorId"] = authorLoggedIn // key value pairs
        if (authorId != authorLoggedIn) {
            return res.status(403).send({ status: false, msg: "LoggedIn id and token doesn't matched" })
        }
        next()
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.authentication = authentication;



// ------------------------------->  authorization == permision   <---------------------------
const authorization = async function(req, res, next) {
    try {
        let authorId = req.authorId;
        let token = (req.headers["x-api-key"]);
        let decodeToken = jwt.verify(token, "Project-one");

        if (!authorId) {

            // ---------------401 Unauthorized response status code
            return res.status(401).send({ status: false, msg: "author must be present" })
        }
        if (authorId == decodeToken.authorId) {
            next()

        } else {
            res.status(401).send({ status: false, msg: "author logged in is not allowed to perform these tasks" });

        }
    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
};

module.exports.authorization = authorization