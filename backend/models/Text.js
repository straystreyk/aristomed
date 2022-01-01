import pkg from "mongoose"

const { Schema, model } = pkg

const schema_text = new Schema({
    page: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

export const Text = model("Text", schema_text)
