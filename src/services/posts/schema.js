import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { Type: String, required: true },
    username: { Type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: { Type: String, required: true },
  },
  { timestamps: true }
);

export default model("post", postSchema);
