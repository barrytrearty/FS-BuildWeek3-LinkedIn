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
    const id = req.params.id;
    const experiences = await experienceSchema.findById(id);

    if (experiences) {
      res.send(experiences);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

experienceRoute.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedExperience = await experienceSchema.findByIdAndDelete(id);

    if (deletedExperience) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Experience with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

experienceRoute.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedExperience = await experienceSchema.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (modifiedExperience) {
      res.send(modifiedExperience);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

// experienceRoute.post("/:id/picture", async (req, res, next) => {
//   try {
//     const id = req.params.id;
//     const updatedExperience = await ExperienceSchema.findById(req.params.id);
//     if (updatedExperience) {
//       console.log("here");
//       const updatedExperience = await ExperienceSchema.findByIdAndUpdate(
//         req.params.id,
//         { $push: { reviews: req.body } },
//         { new: true }
//       );
//       res.send(updatedExperience);
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// experienceRoute.get("/:id/experiences/CSV", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

export default experienceRoute;
