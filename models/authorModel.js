const mongoose = require("mongoose");

// const objectId = mongoose.Schema.Types.ObjectId


const authorSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
    emailId: {
        type: String,
        required: true,
        index: { unique: true },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] //regex.js

    },
    password: {
        type: String,
        required: true
    },


}, { timestamps: true });
module.exports = mongoose.model("pro1Author", authorSchema)