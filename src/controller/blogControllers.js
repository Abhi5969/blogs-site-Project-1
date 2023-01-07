const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const { isValid } = require("../validator/validations")
const validator = require('validator')
const mongoose = require('mongoose');


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, category } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body is require !" })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is mandotary !" })

        if (!isValid(body)) return res.status(400).send({ status: false, msg: "body is mandotary !" })

        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is mandotary !" })

        if (!isValid(authorId)) return res.status(400).send({ status: false, msg: "authorId is mandotary !" })

        if (!mongoose.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: "authorId is not valid !" })
        }
        let authid = req.body.authorId
        if (authid != req.decode.id) return res.status(403).send({ status: false, error: "You are not autherised !" })

        if (data.isPubished == true)
            data.isPubished = Date.now();


        let checkAuthor = await authorModel.findById(authorId);
        if (!checkAuthor) { return res.status(404).send({ status: false, msg: "Author not exist" }) }
        const resultData = await blogModel.create(data)
        res.status(201).send({ status: true, data: resultData })
    } catch (error) {
        res.status(500).send({ staus: false, message: err.message })
    }
}


let getBlogs = async function (req, res) {

    try {
        let authid = req.query.authorId
        if (authid) {
            if (!mongoose.isValidObjectId(authid)) {
                return res.status(400).send({ status: false, msg: " please enter valid authorId!" })
            }
        }
        let saveData = await blogModel.find(req.query)

        let len = saveData.length
        let arr = []
        for (let i = 0; i < len; i++) {
            if (saveData[i].isDeleted == false && saveData[i].isPublished == true) {
                arr.push(saveData[i])
            }
        }
        if (arr.length > 0) {
            res.status(200).send({ Status: true, msg: arr, count: arr.length })
        } else {
            return res.status(404).send({ status: false, msg: " No Sush Blog  Found !" })
        }

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



const updateBlogsById = async function (req, res) {
    try {
        let data = req.body;
        let blogId = req.params.blogId;
        let { title, body, tags, subcategory } = data
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: " please enter valid BlogId !" })
        }
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "No data for update !" });

        let blogData = await blogModel.findById(blogId);
        if (!blogData) return res.status(404).send({ status: false, msg: "blogid is invalide !" });
        let authorid = blogData.authorId
        if (authorid != req.decode.id) return res.status(403).send({ status: false, error: "You are not autherised !" })

        if (blogData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog is already deleted !" });
        }

        if (title) blogData.title = title;

        if (body) blogData.body = body;

        if (tags) {
            if (typeof tags == "object") {
                blogData.tags.push(...tags);
            } else {
                blogData.tags.push(tags);
            }
        }

        if (subcategory) {
            if (typeof subcategory == "object") {
                blogData.subcategory.push(...data.subcategory);
            } else {
                blogData.subcategory.push(data.subcategory);
            }
        }

        blogData.publishedAt = Date.now();
        blogData.isPublished = true;
        await blogData.save();

        res.status(200).send({ status: true, data: blogData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
};



let deleteById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        if (!mongoose.isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: " please enter valid BlogId !" })
        }
        let findBlogId = await blogModel.findById(blogId);
        if (!findBlogId) return res.status(404).send({ status: false, msg: "Id does not exist !" });

        let authorid = findBlogId.authorId
        if (authorid != req.decode.id) return res.status(403).send({ status: false, error: "You are not autherised !" })

        if (findBlogId.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "blog is already deleted !" });
        }
        let date = new Date();

        let deletedData = await blogModel.findOneAndUpdate(
            { _id: blogId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: date } },
            { new: true }
        );

        res.status(200).send()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};



const deleteBlogByquery = async function (req, res) {
    try {
        let filter = {isDeleted: false, authorId: req.authorId}
        let {category,subcategory,tags,authorId} = req.query
        if(authorId){
            if(!mongoose.isValidObjectId(req.query.authorId))
            return res.status(400).send({status:false,msg:"please enter valid authorId"});
            else
            filter.authorId=authorId
        }
        if(category){
            filter.category=category
        }
        if(subcategory){
            filter.subcategory=subcategory
        }
        if(tags){
            filter.tags = tags
        }
        let blogs = await blogModel.findOne(filter)
        if(!blogs)
        return res.status(404).send({ status: false, msg: "No such record found or invalid Id" });
        
        let authorid = blogs.authorId
        if (authorid != req.decode.id)
        return res.status(403).send({ status: false, error: "You are not autherised !" })
        let deleteByquery = await blogModel.updateOne(filter,{isDeleted:true},{new:true})

        return res.status(200).send({ status: true, error: "data is deleted !" })
        

    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}
module.exports = {createBlog,getBlogs,updateBlogsById,deleteBlogByquery,deleteById}
