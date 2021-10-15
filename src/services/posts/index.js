import express from "express";
import q2m from "query-to-mongo";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import mongoose from "mongoose";

import { commentSchema } from "./schema.js";
import postSchema from "./schema.js";

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkedin-products",
  },
});

const postRoute = express.Router();

postRoute.get("/", async (req, res, next) => {
  try {
    const posts = await postSchema.find().populate("user");
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

postRoute.post("/", async (req, res, next) => {
  try {
    const newPost = new postSchema(req.body);
    const { _id } = await newPost.save();
    res.status(201).send(newPost);
  } catch (error) {
    next(error);
  }
});

postRoute.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await postSchema.findById(id).populate("user");
    if (post) {
      res.send(post);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

postRoute.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedPost = await postSchema.findByIdAndDelete(id);

    if (deletedPost) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

postRoute.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedPost = await postSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (modifiedPost) {
      res.send(modifiedPost);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

postRoute.post(
  "/:id",
  multer({ storage: cloudinaryStorage }).single("post-picture"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const modifiedPost = await postSchema.findByIdAndUpdate(
        id,
        { image: req.file.path },
        {
          new: true,
        }
      );
      res.send(modifiedPost);
    } catch (error) {
      next(error);
    }
  }
);

//////////////////////////////////////////////////
/////////////////////EXTRA

// postRoute.post("/:id/like", async (req, res, next) => {
//   const id = req.params.id;
//   console.log(id);
//   const post = await postSchema.findById(id);
//   // console.log(post.likes[0].user.toString());
//   if (post.likes.some((like) => like.user.toString() === req.body.user)) {
//     console.log("Already contains userId");
//     res.send("Already liked");
//   } else {
//     const modifiedPost = await postSchema.findByIdAndUpdate(
//       id,
//       {
//         $push: { likes: req.body },
//       },
//       {
//         new: true,
//       }
//     );
//     if (modifiedPost) {
//       res.send(modifiedPost);
//     } else {
//       next(createHttpError(404));
//     }
//   }
// });

postRoute.post("/:id/like", async (req, res, next) => {
  const id = req.params.id;
  console.log(id);

  const criteria = {
    _id: id,
    "likes.user": new mongoose.Types.ObjectId(req.body.user),
  };
  const isLiked = await postSchema.findOne(criteria);
  // console.log(post.likes[0].user.toString());
  if (isLiked) {
    await postSchema.findByIdAndUpdate(id, {
      $pull: {
        likes: {
          user: new mongoose.Types.ObjectId(req.body.user),
        },
      },
    });

    res.send("like removed");
  } else {
    const modifiedPost = await postSchema.findByIdAndUpdate(
      id,
      {
        $push: { likes: req.body },
      },
      {
        new: true,
      }
    );
    res.send("like added");
  }
});

// postRoute.delete("/:id/like", async (req, res, next) => {
//   const id = req.params.id;
//   const modifiedPost = await postSchema.findByIdAndUpdate(
//     id,
//     {
//       $pull: { likes: req.body },
//     },
//     { new: true }
//   );
//   if (modifiedPost) {
//     res.status(204).send(modifiedPost);
//   } else {
//     next(createHttpError(404, `Post with id ${id} not found!`));
//   }
// });

postRoute.get("/:id/comment", async (req, res, next) => {
  const id = req.params.id;
  const post = await postSchema.findById(id).populate({
    path: "comments",
    populate: {
      path: "user",
      select: "name surname image",
    },
  });
  const postComments = post.comments;
  console.log(postComments);
  // await commentSchema.populate("user");
  if (postComments) {
    res.send(postComments);
  } else {
    next(createHttpError(404, `Post with id ${id} not found!`));
  }
});

postRoute.post("/:id/comment", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedPost = await postSchema.findById(req.params.id);
    if (updatedPost) {
      const updatedPost = await postSchema.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: req.body } },
        { new: true }
      );
      res.send(updatedPost);
    } else {
      next(createHttpError(404, `Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

postRoute.delete("/:id/comment/:comId", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await postSchema.findByIdAndUpdate(
      id,
      {
        $pull: { comments: { _id: req.params.comId } },
      },
      { new: true }
    );
    if (post) {
      res.status(204).send(post);
    } else {
      next(createHttpError(404, `Post with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

postRoute.put("/:id/comment/:comId", async (req, res, next) => {
  try {
    const post = await postSchema.findById(req.params.id);

    if (post) {
      const index = post.comments.findIndex(
        (comment) => comment._id.toString() === req.params.comId
      );
      console.log(index);
      if (index !== -1) {
        post.comments[index] = {
          ...post.comments[index].toObject(),
          ...req.body,
        };
        await post.save();
        res.status(200).send(post);
      } else {
        next(createHttpError(404, `Post with id ${id} not found!`));
      }
    }
  } catch (error) {
    next(error);
  }
});

export default postRoute;
