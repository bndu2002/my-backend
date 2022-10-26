const blogModel = require("../model/blogsModel");
const authorModel = require("../model/authorsModel");

const mongoose = require("mongoose");
const { isValidRequestBody } = require("../validator/validator");

//----------------------------Handler create A blog--------------------------//

const createBlog = async function (req, res) {
  try {
    let { title, authorId, body, category, subcategory, isDeleted, isPublished, tags } = req.body;

    if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "Body can't be empty it must contain some data.", });

    if (!mongoose.isValidObjectId(authorId)) return res.status(400).send({ status: false, msg: "Type of Author Id is must be ObjectId " });

    if (!title) return res.status(400).send({ status: false, msg: "title is required" })

    if (!category) return res.status(400).send({ status: false, msg: "category is required" })

    if (!subcategory) return res.status(400).send({ status: false, msg: "subcategory is required" })

    if (!body) return res.status(400).send({ status: false, msg: "body is required" })

    if (!tags) return res.status(400).send({ status: false, msg: "tags are required" })

    let checkAuthor = await authorModel.findById(authorId);

    if (!checkAuthor) { res.status(401).send({ msg: "author id is invalid" }); }

    if (isPublished == true) {
      //assigned a value (current date) to publishedAt 
      req.body["publishedAt"] = Date.now();
    }
    if (isDeleted == true) {
      //assigned a value (current date) to deleteddAt (default : false)
      //idolly the doc should not get deleted at the time of creation
      req.body["deletedAt"] = Date.now();
    }

    let createData = await blogModel.create(req.body);
    return res.status(201).send({ status: true, data: createData });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

//----------------------------Handler for fetch a blog--------------------------//
const getblog = async function (req, res) {
  try {
    if (Object.keys(req.query).length === 0) {
      let totalBlogs = await blogModel.find({ isDeleted: false, isPublished: true, });

      if (totalBlogs.length === 0) return res.status(404).send({ status: false, msg: "Blogs don't exist" });

      return res.status(200).send({ status: true, data: totalBlogs });
    }

     let { authorId, category, tags, subcategory } = req.query;

    let filterBlogs = await blogModel.find({ $or: [{authorId : authorId} ,{ category: category }, { tags: tags }, { subcategory: subcategory }] })

    //let  filterBlogs = await blogModel.find(req.query)

    if (!filterBlogs.authorId === req.decodedToken.authorId) return res.status(403).send({ status: false, message: "Unauthorized User" })

    if (filterBlogs.length == 0) return res.status(404).send({ status: true, msg: "Request is Not found" });

    return res.status(200).send({ status: true, msg: filterBlogs });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//----------------------------Handler for Update blog--------------------------//
const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    if (!blogId) return res.status(400).send({ status: false, msg: "Blog id is mandatory" });

    if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "Type of BlogId must be ObjectId " });

    let foundDoc = await blogModel.findById(blogId);

    if (foundDoc == null) return res.status(404).send({ status: false, msg: "Blog is not found" });

    // Authorization Starts ---

    let findByBlogId = foundDoc.authorId;
    if (findByBlogId != req.decodedToken.authorId) { return res.status(403).send({ status: false, msg: "Unauthorized Author" }); }

    // Authorization Ends /--

    if (!isValidRequestBody(req.body)) return res.status(400).send({ status: false, message: "Body can't be empty it must contain some data.", });

    let { tags, category, subcategory, title, body } = req.body

    // foundDoc.tags = foundDoc.tags.concat(tags)             
    // foundDoc.subcategory = foundDoc.tags.concat(subcategory);
    // let result1 = foundDoc.tags.filter((b) => b != null);
    // let result2 = foundDoc.subcategory.filter((b) => b != null);

    if (foundDoc && foundDoc.isDeleted == false) {
      // let updatedDoc = await blogModel.findOneAndUpdate(
      //   { _id: blogId },
      //   {
      //     tags: result1,
      //     category: category,
      //     subcategory: result2,
      //     title: title,
      //     body: body,
      //     $set: { isPublished: true, publishedAt: Date.now() },
      //   },
      //   { new: true }
      // );
      // let obj = {
      //   tags: tags.push(tags),
      //   category: category,
      //   subcategory: subcategory.push(subcategory),
      //   title: title,
      //   body: body,

      // }
      let updatedDoc = await blogModel.findByIdAndUpdate(
        { _id: blogId },
        {
          $push: { tags: tags, subcategory: subcategory },
          category: category,
          title: title,
          body: body,
          $set: { isPublished: true, publishedAt: Date.now() }
        },
        { new: true }
      )
      return res.status(200).send({ status: true, msg: "Blog is succesfully Upadated", data: updatedDoc });
    }

    return res.status(400).send({ status: false, msg: "blog has been deleted" });

  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

//----------------------------Handler for Dlete blog--------------------------//

const deleteBlog = async function (req, res) {
  let blogId = req.params.blogId;

  if (!mongoose.isValidObjectId(blogId)) return res.status(400).send({ status: false, msg: "Type of BlogId is must be ObjectId " });

  //Authorization Starts ---

  let findByblogId = await blogModel.findById(blogId);
  let paramBlogId = findByblogId.authorId;

  if (paramBlogId != req.decodedToken.authorId) { return res.status(401).send({ status: false, msg: "Unauthorized Author" }); }
  //Authorization Ends /--

  if (!findByblogId) return res.status(404).send({ status: false, msg: "Blog is not found" });

  if (findByblogId.isDeleted == true) {
    return res.status(400).send({ status: false, msg: "this blog is already deleted." });
  } else {
    let updateblog = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { isDeleted: true },
      { new: true }
    );
    return res.send({ status: true, msg: "blog deleted successfully" });
  }
};

const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;

    if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: "choose what you want to delete" }); }

    //Authorization Starts ---
    if (req.decodedToken.authorId != data.authorId) { return res.status(401).send({ status: false, msg: "Unauthorized Author" }); }
    //Authorization Ends /--

    // find doc which has any of these filters
    let findData = await blogModel.find({
      $or: [
        { tags: data.tags },
        { isPublished: data.isPublished },
        { category: data.category },
        { subcategory: data.subcategory },
      ],
    });


    // find returns an array hence .length , if the lenght is not grater than 0 
    if (!findData.length > 0) {
      return res.status(400).send({ status: false, msg: "no such blog exists" });
    }

    // used for of  for iterable objects (arrays) , traversed over the array updated docs whose isDeleted == false
    // extracted  blogs of the particular author in findData on 177
    for (let items of findData) {
      console.log(items);
      if (items.isDeleted == false) {
        let blogData = await blogModel.findOneAndUpdate(
          { authorId: items.authorId },
          { $set: { isDeleted: true } },
          { new: true }
        );
        return res.status(200).send({ status: false, msg: "deleted successfully" });
      } else {
        return res.status(400).send({ status: false, msg: "already deleted" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createBlog = createBlog;
module.exports.getblog = getblog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;
