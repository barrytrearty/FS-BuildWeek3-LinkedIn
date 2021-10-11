import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { Type: String, requierd: true },
    company: { Type: String, requierd: true },
    startDate: { Type: Date, requierd: true },
    endDate: { Type: Date, requierd: true },
    description: { Type: String, requierd: true },
    area: { Type: String, requierd: true },
    username: { Type: String, requierd: true },
    image: { Type: String, requierd: true },
  },
  { timestampts: true }
);

export default model("experience", experienceSchema);
