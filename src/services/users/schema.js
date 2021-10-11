const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { Type: String, requierd: true },
    surname: { Type: String, requierd: true },
    email: { Type: String, requierd: true },
    bio: { Type: String, requierd: true },
    title: { Type: String, requierd: true },
    area: { Type: String, requierd: true },
    image: { Type: String, requierd: true },
    username: { Type: String, requierd: true },
  },
  { timestampts: true }
);

export default model("user", userSchema);
