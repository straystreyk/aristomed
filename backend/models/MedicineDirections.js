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
  description: {
    type: String,
    required: false,
  },
  descriptionReasons: {
    type: String,
    required: false,
  },
  slogan: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  hoverColor: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  reasons: {
    type: [String],
    required: false,
  },
});

export const MedicineDirection = model(
  "Medicine_Direction",
  MedicineDirectionSchema
);
