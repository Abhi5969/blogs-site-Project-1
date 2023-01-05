const express = require('express');
const router = express.Router();
const authorController = require("../controller/authorController")
const blogController = require("../controller/blogControllers")
const {Authentication,AuthorisationById,AuthorisationToQuery,AuthorisationToCreate} =require("../Middleware/middleMW")

router.post("/authors",authorController.createAuthor)

router.post("/blogs", Authentication,AuthorisationToCreate, blogController.createBlog)

router.get("/blogs", Authentication,blogController.getBlogs)

router.post("/login", authorController.loginAuthor)

router.put("/blogs/:blogId",Authentication,AuthorisationById ,blogController.updateBlogsById)

router.delete("/blogs/:blogId",Authentication ,AuthorisationById,blogController.deleteById)

router.delete("/blogs",Authentication,AuthorisationToQuery, blogController.deleteBlogByquery)

module.exports = router;