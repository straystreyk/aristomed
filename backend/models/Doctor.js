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
  experience: {
    type: Number,
    required: true,
  },
  middle_name: {
    type: String,
  },
  education: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
  },
});

export const Doctor = model("Doctor", DoctorSchema);
