import pkg from "mongoose"

const { Schema, model } = pkg

const schemaUser = new Schema({
    login: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: "Role"
    }],
});

export const User = model("User", schemaUser);
