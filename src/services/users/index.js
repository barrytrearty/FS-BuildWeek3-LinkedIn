import express from "express";
import q2m from "query-to-mongo";

import userSchema from "./schema.js";

const userRoute = express.Router();

userRoute.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

userRoute.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

userRoute.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

userRoute.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

userRoute.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default userRoute;
