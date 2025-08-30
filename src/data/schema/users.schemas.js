import mongoose, { mongo } from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role", // --> ES LA REFERENCIA DEL PRIMER PARAMETRO DE ROL MODEL
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", UserSchema, "users");
