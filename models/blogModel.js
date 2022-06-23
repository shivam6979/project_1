const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId

const proBookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },

    authorId: { type: objectId, ref: 'authorId', required: true },

    tags: { type: [String] },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: [String]
    },


    deleteAt: { type: Date, default: Date.now },

    isDeleted: {
        type: Boolean,
        default: false
    },


    publishedAt: { type: Date, default: Date.now },

    ispublished: {
        type: Boolean,
        default: false
    },


}, { timestand: true });
module.exports = mongoose.model("pro1Blogs", proBookSchema)