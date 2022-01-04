import pkg from "mongoose";

const { Schema, model } = pkg;

const schemaRole = new Schema({
  value: {
    type: String,
    unique: true,
    default: "USER",
  },
});

export const Role = model("Role", schemaRole);
