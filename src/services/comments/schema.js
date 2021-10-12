import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const commentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    comment: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: "post" },
  },
  { timestamps: true }
);

export default model("comment", commentSchema);
