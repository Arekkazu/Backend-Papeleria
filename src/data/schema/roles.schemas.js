import mongoose from "mongoose";

const RolesSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true, // obligatorio
    unique: true, // no se repite
    trim: true, // elimina espacios extra
  },
});
//ROLE, //SCHEMA //role (asi se llama en mongo)
export const Role = mongoose.model("Role", RolesSchema, "role");
