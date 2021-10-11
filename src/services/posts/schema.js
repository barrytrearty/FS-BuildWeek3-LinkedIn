const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    text: { Type: String, requierd: true },
    username: { Type: String, requierd: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: { Type: String, requierd: true },
  },
  { timestampts: true }
);

export default model("post", postSchema);
