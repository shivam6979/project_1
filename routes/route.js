const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController")

const blogController = require("../controllers/blogController")
const middleware = require("../middleware/auth")





// _----------------------------------> Api's for Author <_____________________________________
router.post("/createAuthor", authorController.createAuthor)

router.post("/authorLogIn", authorController.authorLogIn)




// _----------------------------------> Api's for blogs <_____________________________________


router.post("/createBlogs", blogController.createBlogs)

router.get("/getBlogs", middleware.authentication, blogController.getBlogs)

router.put("/updateblogs/:blogId", middleware.authentication, middleware.authorization, blogController.updateBlogs)

router.delete("/deleteblogsById/:blogId", middleware.authentication, middleware.authorization, blogController.deleteBlogById)

router.delete("/deleteBlogByParam", middleware.authentication, middleware.authorization, blogController.deleteBlogByParams)

// if api is invalid or wrong

router.all("/*", function(req, res) {
    res.status(404).send({ status: false, msg: "The api you requested is not available" })
})


router.get("/test", function(req, res) {
    res.send("Programm is running ....!")
});
module.exports = router