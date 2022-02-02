import pkg from "mongoose";

const { Schema, model } = pkg;

const ServiceSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  medicineDirectionsIds: [
    { type: Schema.Types.ObjectId, ref: "Medicine_Direction", required: true },
  ],
});

export const Service = model("Service", ServiceSchema);
