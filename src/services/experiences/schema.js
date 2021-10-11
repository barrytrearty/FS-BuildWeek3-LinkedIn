import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { Type: String, required: true },
    company: { Type: String, required: true },
    startDate: { Type: Date, required: true },
    endDate: { Type: Date, required: true },
    description: { Type: String, required: true },
    area: { Type: String, required: true },
    username: { Type: String, required: true },
    image: { Type: String, required: true },
  },
  { timestamps: true }
);

export default model("experience", experienceSchema);
