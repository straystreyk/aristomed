import pkg from "mongoose";
import * as stream from "stream";

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
  color: {
    type: String,
  },
  hoverColor: {
    type: String,
  },
  services: [
    {
      type: Object,
      ref: "Service",
    },
  ],
});

export const MedicineDirection = model(
  "Medicine_Direction",
  MedicineDirectionSchema
);
