import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, required: true },
    // post: { type: Schema.Types.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    // post: { type: Schema.Types.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    username: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "user" },
    image: { type: String },
    comments: { default: [], type: [commentSchema] },
    likes: { default: [], type: [likeSchema] },
  },
  { timestamps: true }
);

export default model("post", postSchema);
