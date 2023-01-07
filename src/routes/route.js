const express = require('express');
const router = express.Router();
const { loginAuthor, createAuthor } = require("../controller/authorController")
const {createBlog,getBlogs,updateBlogsById,deleteBlogByquery,deleteById} = require("../controller/blogControllers")
const {Authentication} =require("../Middleware/middleMW")

router.post("/authors",createAuthor)

router.post("/blogs", Authentication,createBlog)

router.get("/blogs", Authentication,getBlogs)

router.post("/login", loginAuthor)

router.put("/blogs/:blogId",Authentication,updateBlogsById)

router.delete("/blogs/:blogId",Authentication ,deleteById)

router.delete("/blogs",Authentication, deleteBlogByquery)

module.exports = router;