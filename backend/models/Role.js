import {Schema, model} from "mongoose"

const schemaRole = new Schema({
    value: {
        type: String,
        unique: true,
        default: "USER"
    }
})

export const Role = model("Role", schemaRole)
