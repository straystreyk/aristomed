import pkg from "mongoose"

const { Schema, model } = pkg

const schema_doctor = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
    },
    middle_name: {
        type: String
    },
    education: {
        type: String,
    },
    image: {
        type: String,
    }
});

export const Doctor = model("Doctor", schema_doctor);
