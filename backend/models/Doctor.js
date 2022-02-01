import pkg from "mongoose";

const { Schema, model } = pkg;

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  middle_name: {
    type: String,
    default: "",
  },
  education: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
});

export const Doctor = model("Doctor", DoctorSchema);
