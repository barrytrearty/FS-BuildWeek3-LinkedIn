import mongoose from "mongoose";
// import { experienceSchema } from "../experiences/schema.js";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    area: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String, required: true },
    // role: { type: String },
    // company: { type: String },
    // startDate: { type: String },
    // endDate: { type: String },
    // description: { type: String },
    // area: { type: String },
    // username: { type: String },
    // image: { type: String },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: true },
    title: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, required: true },
    username: { type: String, required: true },
    experiences: { default: [], type: [experienceSchema] },
    connections: [{ default: [], type: Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

export default model("user", userSchema);
