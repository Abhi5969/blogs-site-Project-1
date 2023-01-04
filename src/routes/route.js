const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogControllers")


router.post("/authors",authorController.createAuthor)

router.post("/blogs", blogController.createBlog)

router.get("/blogs", blogController.getBlogs)

router.put("/blogs/:blogId", blogController.updateBlogsById)

router.delete("/blogs/:blogId", blogController.deleteById)

router.delete("/blogs", blogController.deleteBlogByquery)

router.post("/login", authorController.loginAuthor)


module.exports = router;