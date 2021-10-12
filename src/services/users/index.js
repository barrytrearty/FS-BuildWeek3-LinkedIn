import express from "express";
import q2m from "query-to-mongo";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import PdfPrinter from "pdfmake";
import { pipeline } from "stream";

import { Parser } from "json2csv";

import userSchema from "./schema.js";

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linked-products",
  },
});

const userRoute = express.Router();

userRoute.get("/", async (req, res, next) => {
  try {
    const users = await userSchema.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRoute.post("/", async (req, res, next) => {
  try {
    const newUser = new userSchema(req.body);
    const { _id } = await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

userRoute.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findById(id);

    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedUser = await userSchema.findByIdAndDelete(id);

    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const modifiedUser = await userSchema.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (modifiedUser) {
      res.send(modifiedUser);
    } else {
      next(createHttpError(404));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.post(
  "/:id/picture",
  multer({ storage: cloudinaryStorage }).single("user-picture"),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const modifiedUser = await userSchema.findByIdAndUpdate(
        id,
        { image: req.file.path },
        {
          new: true,
        }
      );
      res.send(modifiedUser._id);
    } catch (error) {
      next(error);
    }
  }
);

/////////////////////////////////////// EXPERIENCES ////////////////////

userRoute.get("/:id/experiences", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findById(id);
    if (user) {
      res.send(user.experiences);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.post("/:id/experiences", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedUser = await userSchema.findById(req.params.id);
    if (updatedUser) {
      const updatedUser = await userSchema.findByIdAndUpdate(
        req.params.id,
        { $push: { experiences: req.body } },
        { new: true }
      );
      res.send(updatedUser);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.delete("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findByIdAndUpdate(
      id,
      {
        $pull: { experiences: { _id: req.params.expId } },
      },
      { new: true }
    );
    if (user) {
      res.status(204).send(user);
    } else {
      next(createHttpError(404, `User with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

userRoute.put("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.params.id);

    if (user) {
      const index = user.experiences.findIndex(
        (experience) => experience._id.toString() === req.params.expId
      );
      console.log(index);
      if (index !== -1) {
        user.experiences[index] = {
          ...user.experiences[index].toObject(),
          ...req.body,
        };
        await user.save();
        res.send(user);
      } else {
        next(createHttpError(404, `Blog Post with id ${id} not found!`));
      }
    }
  } catch (error) {
    next(error);
  }
});

userRoute.post(
  "/:id/experiences/:expId/picture",
  multer({ storage: cloudinaryStorage }).single("exp-picture"),
  async (req, res, next) => {
    try {
      const user = await userSchema.findById(req.params.id);

      if (user) {
        const index = user.experiences.findIndex(
          (experience) => experience._id.toString() === req.params.expId
        );
        console.log(index);
        if (index !== -1) {
          user.experiences[index] = {
            ...user.experiences[index].toObject(),
            image: req.file.path,
          };
          await user.save();
          res.send(user);
        } else {
          next(createHttpError(404, `Blog Post with id ${id} not found!`));
        }
      }
      // res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

/////////////////////////////////////////////////////////////

const generatePDFAsync = (userObj) => {
  // const asyncPipeline = promisify(pipeline);

  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      // italics: "fonts/Roboto-Italic.ttf",
      // bolditalics: "fonts/Roboto-MediumItalic.ttf",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      userObj.name,
      userObj.surame,
      userObj.bio,
      userObj.email,
      userObj.title,
      "Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines",
    ],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});

  pdfReadableStream.end();

  return pdfReadableStream;
};

/////////////////////////////////////////////////////////////
/// PDF CV Route

userRoute.get("/:id/CV", async (req, res, next) => {
  try {
    // const { id } = req.body;
    const id = req.params.id;
    const user = await userSchema.findById(id);
    res.setHeader("Content-Disposition", `attachment; filename=example.pdf`);
    const path = generatePDFAsync(user);

    // res.send(path);
    const destination = res;

    pipeline(path, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    next(error);
  }
});

/////////////////////////////////////////
userRoute.get("/:id/experiences/CSV", async (req, res, next) => {
  try {
    const source = await userSchema.findById(req.params.id);
    console.log(source);
    if (source) {
      const jsonData = JSON.parse(JSON.stringify(source.experiences));
      const fields = [
        "_id",
        "role",
        "company",
        "description",
        "area",
        "username",
        "startDate",
        "endDate",
      ];
      const options = { fields };
      const json2csvParser = new Parser(options);
      // const Json2csvParser = json2csv.Parser;

      const csvData = json2csvParser.parse(jsonData);
      res.setHeader(
        "Content-Disposition",
        "attachment; filename = experiences.csv"
      );
      res.set("Content-Type", "text/csv");
      res.status(200).end(csvData);
    }
  } catch (error) {
    next(error);
  }
});

userRoute.get("/:id/experiences/:expId", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userSchema.findById(id);
    if (user) {
      const userExperience = user.experiences.find(
        (experience) => experience._id.toString() === req.params.expId
      );
      if (userExperience) {
        res.send(userExperience);
      } else {
        next(createHttpError(404, `Experience with id ${id} not found!`));
      }
      // res.send(user.reviews);
    }
  } catch (error) {
    next(error);
  }
});
export default userRoute;
