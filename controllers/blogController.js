const blogModel = require("../models/blogModel")
const auth = require("../middleware/auth")

const mongoose = require('mongoose')


const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false // check if the value is undefied or not a string. 
    if (typeof value === 'string' && value.trim().length === 0) return false // check if the value is string- 
        //-and if there is spaces in that string so trim is delete or remove that space 
    return true
}



// const isValidBody = function(body) {
//     return Object.keys(body).length > 0
// }

// const isValidObjectId = function(ObjectId) {
//     return mongoose.Types.ObjectId.isValid(ObjectId)
// }

// creating the blogs



const createBlogs = async function(req, res) {
    try {
        let blog = req.body



        // destructure
        let { title, body, authorId, category } = blog
        if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide the title" })
        }
        if (!isValid(body)) {
            return res.status(400).send({ status: false, msg: "Please provide the body" })
        }

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "Please provide the authorId" })
        }

        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "Please provide the category" })

        }
        let blogCreated = await blogModel.create(blog)
        res.status(200).send({ status: true, data: blogCreated })
    } catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}
module.exports.createBlogs = createBlogs





// ----------------------------------------------------->   getBlogs    <---------------------------------------------------

const getBlogs = async function(req, res) {
    try {
        const blogs = await blogModel.find({
            $and: [{ isDeleted: false }, { ispublished: true }],
            //$and performs a logical AND operation on an array of one or more expressions 
            // ( < expression1 > , < expression2 > , and so on) and selects the documents that satisfy all the expressions.
        });
        if (blogs.length !== 0) {
            return res.status(200).send({ status: true, data: blogs });
        } else {
            res.status(404).send({ status: false, message: "No blogs found" });
        }

        let searchBlogs = await blogModel.find({
            $or: [
                { autherId: req.query.autherId },
                { tags: req.query.tag },
                { category: req.query.category },
                { subcategory: req.query.subcategory },
            ],
        });
        let result = [];
        if (searchBlogs.length > 0) {
            for (let element of searchBlogs) {
                if (element.isDeleted == false && element.ispublished == true) {
                    result.push(element);
                }
            }
        } else {
            return res
                .status(404)
                .send({ status: false, message: "No blogs found" });
        }
        return res.status(200).send({ status: true, data: result });

    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }


};

module.exports.getBlogs = getBlogs;





// ----------------------------------------------------->   updateBlogs    <---------------------------------------------------
const updateBlogs = async function(req, res) {
    try {
        let data = req.body;
        const blogs = await blogModel.findOne({ _id: req.params.blogId, isDeleted: false })
        if (!blogs) {
            return res.status(404).send({ status: false, msg: "no blogs" });
        }
        let updatedData = { publishedAt: new Date(), ispublished: true }
        if (data.title) {
            updatedData.title = data.title;
        }
        if (data.body) {
            updatedData.body = data.body
        }
        if (data.tags) {
            updatedData.$addToSet = { tags: data.tags }
        }
        if (data.subcategory) {
            updatedData.$addToSet = { subcategory: data.subcategory }
        }

        let updatedBlog = await blogModel.findOneAndUpdate({ _id: req.params.blogId, isDeleted: false }, updatedData, { new: true })
        res.status(200).send({ msg: " updated", data: updatedBlog })

    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

module.exports.updateBlogs = updateBlogs;





// ------------------------------------ delete by params using id DELETE /blogs/:blogId ---------------------------------//

const deleteBlogById = async function(req, res) {
    try {

        let blogId = req.params.blogId;

        let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })
        if (!blog) {
            res.status(404).send({ status: false, msg: "No such blog exits or blog is deleted" })
        }
        if (blog.isDeleted == true) {
            res.status(404).send({ status: false, msg: "Blog is already deleted " })
        }

        // the $set operator is used to replace the value of a field to the specified value. If the given field
        //  does not exist in the document, the $set operator will add the field to the specified value
        let afterDelete = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true }) //$ is used to identify, jut like name 
        res.status(200).send({ status: true, msg: afterDelete })

    } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }

}
module.exports.deleteBlogById = deleteBlogById




// -------------------------------------------------- Delete by query params--------------------------//


const deleteBlogByParams = async function(req, res) {

    try {
        let body = req.query //check req.query has element or not
        if (!body) {
            // 404 not found, 404, 404 error, page not found or file not found error
            res.status(404).send({ status: false, msg: "No such blog exists or the blog is deleted" })
        }


        // ---------------->  destructuring     <------------------
        let (title, category, autherid, tags, subcategory, ispublished) = body; // take all the element in the body container or variable


        if (!title) {
            // 400 Bad Request
            res.status(400).send({ status: false, msg: "No such tittle found" })
        }

        if (!category) {
            res.status(400).send({ status: false, msg: "No such category exist" })
        }

        if (!authorid) {
            res.send.status(400).send({ status: false, msg: "No such author found" });
        }

        if (!tags) {
            res.status(400).send({ status: false, msg: "No such" })
        }

        if (!subcategory) {
            res.status(400).send({ status: false, msg: "No such subcategory found" })
        }
        if (!ispublished) {
            res.status(400).send({ status: false, msg: "No such book found" })
        }

        let blog = await blogModel.find(body).select({ authorId: 1, _id: 1 }) ///


        if (!blog) {
            res.status(404).send({ status: false, msg: "No blog found" })
        }


        // The $in operator selects the documents where the value of a field equals any value in the specified array. 
        let deleteBlog = await blogModel.findOneAndUpdate({ _id: { $in: blog } }, { $set: { isDeleted: true } }, { new: true })
        res.status(200).send({ status: true, body: deleteBlog })


    } catch (err) {
        res.status(500).send({ msg: "error", error: err.message })
    }
}


module.exports.deleteBlogByParams = deleteBlogByParams