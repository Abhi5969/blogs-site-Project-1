const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const { isValid } = require("../validator/validations")
const validator = require('validator')


const createBlog = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, category } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body is mandotary" })

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is mandotary" })

        if (!isValid(body)) return res.status(400).send({ status: false, msg: "body is mandotary" })

        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is mandotary" })

        if (authorId.length != 24) return res.status(400).send({ status: false, msg: "authorId is not valid" })
        let authid = req.body.authorId
        if (Object.keys(authid).length == 0) return res.status(404).send({ status: false, Error: "data is required" })

        if (authid != req.decode.id) return res.status(403).send({ status: false, error: "You are not autherised" })

        let validTitle = validator.isAlpha(title.trim())
        
        if (validTitle == false) return res.status(400).send({ status: false, msg: "title have to alphabat" })



        if (data.isPubished == true) {
            let date = Date();
            data["publishedAt"] = date;
            data.publishedAt.save()

        }
        let id = authorId
        let checkAuthor = await authorModel.findById(id);
        if (!checkAuthor) { return res.status(404).send({ status: false, msg: "Author not exist" }) }
        const resultData = await blogModel.create(data)
        res.status(201).send({ status: true, data: resultData })
    } catch (error) {
        res.status(500).send({ staus: false, message: err.message })
    }
}
module.exports.createBlog = createBlog

let getBlogs = async function (req, res) {

    try {

        let data = req.query
        data.isDeleted = false  //mst cheez h
        data.isPublished = true

        let saveData = await blogModel.find(data)
        if (saveData.length === 0) return res.status(404).send({ status: false, msg: "Blog Not Found" })
        res.status(200).send({ Status: true, msg: saveData })

    }
    catch (error) {
        console.log(error.massage)
        res.status(500).send({ error: error.massage, msg: "Server error" })
    }
}

module.exports.getBlogs = getBlogs;

const updateBlogsById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        let data = req.body;
        let { title, body, tags, subcategory } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "body is mendatory" });
        // if(!data)return res.status(400).send({ status: false, msg: "body is mendatory" });

        let blogData = await blogModel.findOne({ _id: blogId, isDeleted: false });
        if (!blogData) return res.status(404).send({ status: false, msg: "blog is not present" });


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

        blogData.publishedAt = Date();
        blogData.isPublished = true;
        await blogData.save();

        res.status(200).send({ status: true, data: blogData });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ status: false, msg: error.message });
    }
};

module.exports.updateBlogsById = updateBlogsById;

let deleteById = async function (req, res) {
    try {
        let blogId = req.params.blogId;
        if (!blogId) return res.status(400).send({ status: false, msg: "please enter blogId " });

        let findBlogId = await blogModel.findOne({ _id: blogId, isDeleted: false });
        if (!findBlogId) return res.status(404).send({ status: false, msg: "Blog  not found" });



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

module.exports.deleteById = deleteById;

const deleteBlogByquery = async function (req, res) {
    try {
        let data = req.query
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, Error: "data is required in query params" })


        let savedData = await blogModel.findOne(data, { isDeleted: false })
        if (!savedData) return res.status(404).send({ status: false, Error: "No Blog Found" })
        let date = new Date()
        savedData.isDeleted = true;
        savedData.deletedAt = date

        await savedData.save()

        res.status(200).send({ status: false, Msg: "data is deleted" })


    } catch (error) {
        res.status(500).send({ status: false, Error: error.message })
    }
}
module.exports.deleteBlogByquery = deleteBlogByquery;
