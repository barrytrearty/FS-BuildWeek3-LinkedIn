import express from "express";
import q2m from "query-to-mongo";

import experienceSchema from "./schema.js";

const experienceRoute = express.Router();

experienceRoute.get("/", async (req, res, next) => {
  try {
    const experiences = await experienceSchema.find();
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experienceRoute.post("/", async (req, res, next) => {
  try {
    const newExperience = new experienceSchema(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(newExperience);
  } catch (error) {
    next(error);
  }
});

experienceRoute.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

experienceRoute.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

experienceRoute.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

experienceRoute.post("/:id/picture", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

experienceRoute.get("/:id/experiences/CSV", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default experienceRoute;
