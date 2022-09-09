const authorsModel = require("../model/authorsModel");
const { find } = require("../model/blogsModel");
//const { find } = require("../model/blogsModel");
const blogsModel = require("../model/blogsModel");


const createBlog = async function (req, res) {
  try {
    let data = req.body;

    let checkAuthor = await authorsModel.findById(data.authorId);

    if (!checkAuthor) {
      return res.status(401).send({ msg: "author id is invalid" });
    }
    if (data.isPublished == true) {
      //created new  key "publishedAt" in data
      data["publishedAt"] = new Date();
    }
    if (data.isDeleted == true) {
      //created new  key "deletedAt" in data
      data["deletedAt"] = new Date();
    }

    let createData = await blogsModel.create(data);
    return res.status(201).send({ status: true, data: createData });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let foundDoc = await blogsModel.findById(req.params.blogId);
    let tags = req.body.tags;
    let category = req.body.category;
    let subcategory = req.body.subcategory;
    let title = req.body.title;
    let bodyData = req.body.body;
    foundDoc.tags = foundDoc.tags.concat(tags);

    foundDoc.subcategory = foundDoc.tags.concat(subcategory);
    let result1 = foundDoc.tags.filter((b) => b != null);
    let result2 = foundDoc.subcategory.filter((b) => b != null);
    if (!req.params.blogId) {
      return res.status(400).send({ status: false, msg: "id is mandatory" });
    }

    if (foundDoc && foundDoc.isDeleted == false) {
      let updatedDoc = await blogsModel.findOneAndUpdate(
        { _id: req.params.blogId },
        {
          tags: result1,
          category: category,
          subcategory: result2,
          title: title,
          bodyData: bodyData,
          $set: { isPublished: true, publishedAt: Date.now() },
        },
        { new: true }
      );

      let data = await blogsModel.findById({ _id: req.params.blogId });
      return res.status(200).send({ status: true, data: updatedDoc });
    }
    return res.status(401).send({
      status: false,
      msg: "id not available / invalid or the document is deleted",
    });
  } catch (error) {
    return res.status(500).send({ msg12: error.message });
  }
};

// const deleteBlogByQuery = async function (req, res) {
//   try {
//     let data = req.query;
//     console.log(".........here", data);
//     // let blogObjId = data._id;
//     // let authorObjId = data.authorId;
//     let category = req.query.category
    

//     let findData = await blogsModel.findOne(data);
//     console.log(".......", typeof(findData));

//     if (Object.keys(data).length === 0) {
//       return res
//         .status(400)
//         .send({ status: false, msg: "choose what you want to delete" });
//     }

    
//     // if (blogObjId) {
//     //   if (findData != blogObjId) {
//     //     return res.status(400).send({status:false , msg : "invalid blog id"});
//     //   }
//     // }

//     // if (authorObjId) {
//     //   if (findData != authorObjId) {
//     //     return res.status(400).send({status : false , msg : "invalid author id"});
//     //   }
//     // }

//     if(findData === null){
//       return res.status(400).send({status:false , msg :"no such blog exists"})
//     }
    
    

//     if(!data.body || data.tags || data.authorId ||data.subcategory||data.title|| category ||data.isPublished||data._id){
//       return res.status(400).send({status : false , msg : "please enter a valid filter"})
//     }
//     console.log("=======>",typeof(data.category))


//     //combined validation for authorId and blogId====================>this is working
//     // if ( findData === null) {
//     //   return res.status(404).send({status : false , msg : "blog does not exist"});
//     // }

//    // if(data.tags){
//     // if(findData.tags != data.tags){
//     //   return res.send("enter a valid filter")
//     // }

//     // if(data.subcategory){
//     // if(findData.subcategory != data.subcategory){
//     //  return res.send("enter a valid filter")
//     // }}

//     // if(findData.category != data.category){
//     //   return res.send("enter a valid filter")
//     //  }
    
//     // if (findData.isPublished != data.isPublished) {
//     //   return res.send("enter a valid filter");
//     // }

//     // if(data.body){
//     //   if(data.body != findData.body){
//     //     res.send("enter valid filter")
//     //   }
//     // }

//     // if (data.title) {
//     //   if (findData.title != data.title) {
//     //     return res.status(400).send("enter a valid filter");
//     //   }
//     // }
   
//     // subcategory.join(" ") //opposite of join
//     //           .split(",")// lets use more then one values for array in query param
    
//     // if (findData.body != data.body) 
//     // {
//     //   console.log("error")
//     //   return res.status(400).send("enter a valid filter");
//     // }

//     if (findData.isDeleted == true) {
//       return res
//         .status(404)
//         .send({ status: false, msg: "blog is already deleted" });
//     }

//     let updateData = await blogsModel.updateMany(
//       data,
//       { $set: { isDeleted: true } },
//       { new: true }
//     );
//     return res
//       .status(200)
//       .send({ status: true, msg: "blog is deleted successfully" });
//   } catch (error) {
//     return res.status(500).send({ status: false, msg: error.message });
//   }
// };
//successfull code
const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, msg: "choose what you want to delete" });
    }
    if (req.decodedToken.authorId != data.authorId) {
      return res
        .status(401)
        .send({ status: false, msg: "Unauthorized Author" });
    }

    let findData = await blogModel.find({
      $or: [
        { tags: data.tags },
        { isPublished: data.isPublished },
        { category: data.category },
        { subcategory: data.subcategory },
      ],
    });
    console.log(".......", findData);

    if (!findData.length > 0) {
      return res
        .status(400)
        .send({ status: false, msg: "no such blog exists" });
    }

    for (let items of findData) {
      console.log(items);
      if (items.isDeleted == false) {
        console.log("jaaaaaaa");
        let blogData = await blogModel.findOneAndUpdate(
          { authorId: items.authorId },
          { $set: { isDeleted: true } },
          { new: true }
        );
        return res
          .status(200)
          .send({ status: false, msg: "deleted successfully" });
      } else {
        return res.status(400).send({ status: false, msg: "already deleted" });
      }
    }
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};







module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;


