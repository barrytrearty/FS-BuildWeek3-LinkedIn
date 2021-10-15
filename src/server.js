import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import userRoute from "./services/users/index.js";
import postRoute from "./services/posts/index.js";
// import experienceRoute from "./services/experiences/index.js";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} from "./errorHandlers.js";

const server = express();
const port = process.env.PORT || 5000;

const whiteList = [process.env.FRONT_DEV_URL, process.env.FRONT_PROD_URL];

const corsOptions = {
  origin: function (origin, next) {
    console.log("CURRENT ORIGIN: ", origin);
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error(`Origin ${origin} not allowed!`));
    }
  },
};

server.use(cors(corsOptions));

server.use(express.json());

server.use("/users", userRoute);
// server.use("/experiences", experienceRoute);
server.use("/posts", postRoute);

/////////////////////////////////////////////////

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (error) => {
  console.log("Server is stoppped ", error);
});
