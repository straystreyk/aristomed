import pkg from "mongoose";

const { Schema, model } = pkg;

const EducationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: [String],
    required: true,
  },
});

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: false,
  },
  middle_name: {
    type: String,
  },
  education: [
    {
      type: [EducationSchema],
      required: false,
    },
  ],
  medicine_direction_ids: [
    { type: Schema.Types.ObjectId, ref: "Medicine_Direction", required: false },
  ],
  image: {
    type: String,
  },
});

export const Doctor = model("Doctor", DoctorSchema);
