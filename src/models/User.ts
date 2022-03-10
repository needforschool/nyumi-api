import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: String,
  password: String,
  firstname: String,
  createdAt: String,
  recover: {
    code: String,
    createdAt: String,
  },
});

export default model("User", userSchema);