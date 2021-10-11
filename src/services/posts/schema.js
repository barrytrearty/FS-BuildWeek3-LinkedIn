import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user" },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("post", postSchema);
