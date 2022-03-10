import pkg from "mongoose";

const { Schema, model } = pkg;

const MedicineDirectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  urlName: {
    type: String,
    required: true,
  },
  doctorDirectionName: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  hoverColor: {
    type: String,
  },
});

export const MedicineDirection = model(
  "Medicine_Direction",
  MedicineDirectionSchema
);
