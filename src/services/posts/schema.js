import mongoose from "mongoose";
const { Schema, model } = mongoose;

const likeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    // post: { type: Schema.Types.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

export const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, required: true },
    likes: { default: [], type: [likeSchema] },
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
