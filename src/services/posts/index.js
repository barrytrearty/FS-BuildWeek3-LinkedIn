import express from "express";
import q2m from "query-to-mongo";

import postSchema from "./schema.js";

const postRoute = express.Router();

postRoute.get("/", async (req, res, next) => {
  try {
    const posts = await postSchema.findAll();
    res.send(posts);
  } catch (error) {
    next(error);
  }
});

// postRoute.post("/", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// postRoute.get("/:id", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// postRoute.delete("/:id", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// postRoute.put("/:id", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

// postRoute.post("/:id/image", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

export default postRoute;
