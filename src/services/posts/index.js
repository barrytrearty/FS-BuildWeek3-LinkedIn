import express from "express";
import q2m from "query-to-mongo";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

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

export default postRoute;
