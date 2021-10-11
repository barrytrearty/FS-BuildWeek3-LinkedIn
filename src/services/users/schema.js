import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { Type: String, required: true },
    surname: { Type: String, required: true },
    email: { Type: String, required: true },
    bio: { Type: String, required: true },
    title: { Type: String, required: true },
    area: { Type: String, required: true },
    image: { Type: String, required: true },
    username: { Type: String, required: true },
  },
  { timestamps: true }
);

export default model("user", userSchema);
